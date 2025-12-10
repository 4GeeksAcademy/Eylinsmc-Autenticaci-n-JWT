"""
This module takes care of starting the API Server, loading the DB
and adding the endpoints.
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager

# Determine environment
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

# Static files (React build)
static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "../dist/"
)

app = Flask(__name__)
app.url_map.strict_slashes = False

# Enable CORS
CORS(app)

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    # Heroku style URL fix
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace(
        "postgres://", "postgresql://"
    )
else:
    # Local sqlite fallback
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Migrations
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Admin
setup_admin(app)

# Custom CLI commands (from boilerplate)
setup_commands(app)

# Register API blueprint with /api prefix
app.register_blueprint(api, url_prefix="/api")

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
jwt = JWTManager(app)


# Error handler for APIException
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


# Sitemap of endpoints (only in development)
@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")


# Serve static files (React build) for any other route
@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"
    response = send_from_directory(static_file_dir, path)
    # Avoid cache while developing
    response.cache_control.max_age = 0
    return response


# This only runs if `$ python src/app.py` is executed directly
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
