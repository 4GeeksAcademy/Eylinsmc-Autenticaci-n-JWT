"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Blueprint, request, jsonify
from api.models import db, User
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from datetime import timedelta

api = Blueprint("api", __name__)
CORS(api)


@api.route("/health-check", methods=["GET"])
def health_check():
    return jsonify({"status": "OK"}), 200


# REGISTRO
@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "Missing JSON"}), 400

    email = (body.get("email") or "").strip()
    password = (body.get("password") or "").strip()

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"msg": "User already exists"}), 400

    password_hash = generate_password_hash(password)

    user = User(
        email=email,
        password=password_hash,
        is_active=True
    )
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as error:
        db.session.rollback()
        print("Error creating user:", error)
        return jsonify({"msg": "Error creating user"}), 500


# LOGIN
@api.route("/login", methods=["POST"])
def login():
    body = request.get_json()

    if body is None:
        return jsonify({"message": "Missing JSON"}), 400

    email = (body.get("email") or "").strip()
    password = (body.get("password") or "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).one_or_none()

    if user is None:
        return jsonify({"message": "Invalid email"}), 400

    if not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 400

    token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(days=1)
    )

    return jsonify({"token": token}), 200


# RUTA PRIVADA
@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "msg": "Access to private route granted",
        "user": user.serialize()
    }), 200
