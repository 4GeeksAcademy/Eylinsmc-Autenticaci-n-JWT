"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Todos
from api.utils import generate_sitemap, APIException, es_correo_valido, send_email
from flask_cors import CORS
import os
from base64 import b64encode
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import cloudinary.uploader as uploader


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/health-check", methods=["GET"])
def health_check():
    return jsonify({"status": "OK"}), 200


@api.route("/register", methods=["POST"])
def register_user():
    data_form = request.form
    data_files = request.files

    print(data_form)

    data = {
        "email": data_form.get("email"),
        "password": data_form.get("password"),
        "lastname": data_form.get("lastname"),
        "avatar": data_files.get("avatar"),
        "is_active": True,
        "salt": 1
    }

    if not data["email"] or not data["lastname"] or not data["password"]:
        return jsonify({"message": "Email, Lastname and password are required"}), 400

    if not es_correo_valido(data["email"]):
        return jsonify({"message": "Emails is invalid, example@email.com"}), 400

    # devuelve None or User
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User already exists"}), 409

    salt = b64encode(os.urandom(32)).decode("utf-8")
    password = generate_password_hash(f"{data['password']}{salt}")

    avatar = "https://i.pravatar.cc/300"

    if data.get("avatar") is not None:
        avatar = uploader.upload(data.get("avatar"))
        avatar = avatar["secure_url"]

    print(avatar)

    new_user = User(
        email=data["email"],
        password=password,
        lastname=data["lastname"],
        is_active=data["is_active"],
        avatar=avatar,
        salt=salt
    )

    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({"message": "user created succesfuly"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Error creating user", "Error": f"{error.args}"}), 500


@api.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()

    email = data.get("email").strip()
    password = data.get("password").strip()

    print(password)

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).one_or_none()

    if user is None:
        return jsonify({"message": "Ivalid email"}), 400

    if not check_password_hash(user.password, f"{password}{user.salt}"):
        return jsonify({"message": "Ivalid credentials"}), 400
    else:
        return jsonify({"token": create_access_token(identity=str(user.id), expires_delta=timedelta(days=(1)))}), 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    id = get_jwt_identity()
    return jsonify({"message": f"This is a protected route. Currente user ID : {id}"})


@api.route("/me", methods=["GET"])
@jwt_required()
def me():
    id = get_jwt_identity()
    user = User.query.get(id)

    return jsonify({"user": user.serialize()}), 200


@api.route("/send-mail", methods=["GET"])
def send_mail():
    subject = " Esta es una prueba de correo"
    to = "carlosocharly1@hotmail.com"
    body = """
                <div>
                    <h1>Este es un test de correo electronico</h1>
                    <p>Un texto grande de promoción</p>
                </div>
            """

    try:
        send_email(subject, to, body)
        return jsonify({"message": " Email sended successfully"}), 200
    except Exception as error:
        print(error)
        return jsonify({"message": f"Error: {error.args}"})


@api.route("/reset-password", methods=["POST"])
def recovery_password():
    data = request.get_json()
    print(data)

    # en caso de querer decir si el usuario existe
    # user = User.query.filter_by(email=data.get("email")).one_or_none()

    recovery_token = create_access_token(identity=str(
        data.get("email")), expires_delta=timedelta(minutes=15))

    message = f"""
                <div>
                    <h1>Recuperación de contraseña, ingresa en el siguiente link</h1>
                    <a 
                        href="https://chilling-spooky-hobgoblin-ppgwrqgxvg5hr9pr-3000.app.github.dev/password-update?token={recovery_token}"
                    >
                        ir a recuperar contraseña
                    </a>
                </div>

                """

    subject = "Correo de recuperación de contraseña"
    email = data.get("email")
    print(email)
    try:
        response = send_email(subject, email, message)
        if response:
            return jsonify({"message": "Correo enviado exitosamente"}), 200
        else:
            return jsonify({"message": "Intentelo nevamente"}), 400
    except Exception as error:
        return jsonify({"message": f"Error al enviar correo de recuperación"}), 500


@api.route("/update-password", methods=["PUT"])
@jwt_required()
def update_password():
    email = get_jwt_identity()
    password = request.get_json()

    user = User.query.filter_by(email=email).one_or_none()

    if user is not None:
        salt = b64encode(os.urandom(32)).decode("utf-8")
        password = generate_password_hash(f"{password.get("password")}{salt}")

        user.salt = salt
        user.password = password

        try:
            db.session.commit()
            return jsonify({"message": "Contraseña actualizada exitosamente"}), 200
        except Exception as error:
            return jsonify({"message": "Error al actualizar la contraseña"}), 500

    return jsonify({"message": "Intentelo nuevamente, si el error persiste comuniquese con soporte"}), 400


# ============= RUTAS PARA TAREAS =============

@api.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Todos.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        "tasks": [{
            "id": task.id,
            "title": task.label,
            "completed": task.is_done
        } for task in tasks]
    }), 200


@api.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data.get("title"):
        return jsonify({"message": "Title is required"}), 400
    
    new_task = Todos(
        label=data.get("title"),
        user_id=user_id,
        is_done=False
    )
    
    db.session.add(new_task)
    
    try:
        db.session.commit()
        return jsonify({
            "task": {
                "id": new_task.id,
                "title": new_task.label,
                "completed": new_task.is_done
            }
        }), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Error creating task", "error": str(error)}), 500


@api.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    task = Todos.query.filter_by(id=task_id, user_id=user_id).one_or_none()
    
    if task is None:
        return jsonify({"message": "Task not found"}), 404
    
    if "title" in data:
        task.label = data.get("title")
    if "completed" in data:
        task.is_done = data.get("completed")
    
    try:
        db.session.commit()
        return jsonify({
            "task": {
                "id": task.id,
                "title": task.label,
                "completed": task.is_done
            }
        }), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Error updating task", "error": str(error)}), 500


@api.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    
    task = Todos.query.filter_by(id=task_id, user_id=user_id).one_or_none()
    
    if task is None:
        return jsonify({"message": "Task not found"}), 404
    
    db.session.delete(task)
    
    try:
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Error deleting task", "error": str(error)}), 500