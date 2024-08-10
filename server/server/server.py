from flask import Flask, request, jsonify
from functools import wraps

from errors.api_exception import ApiException, BadRequest
from errors.error_types import ErrorType
from usecases.login_use_case import LogInUseCase
from usecases.metrics_use_case import MetricsUseCase
from usecases.users_service import SignUpUseCase
from domain.user import User
from logger.logger import log_error

AUTH_HEADER = "x-auth-token"


class Server:
    def __init__(self, db):
        self.app = Flask(__name__)
        self.db = db
        self.login_use_case = LogInUseCase(db)
        self.users_service = SignUpUseCase(db)
        self.metrics_use_case = MetricsUseCase(db)
        self.register_routes()

    def is_authorized(self, func):
        @wraps(func)
        def decorated(*args, **kwargs):
            token = request.headers.get(AUTH_HEADER)
            if token is None:
                ex = BadRequest(ErrorType.MISSING_AUTH_TOKEN)
                return jsonify(ex.to_dict()), ex.status

            try:
                decoded = self.login_use_case.validate_token(token)
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

            return func(decoded.get("user_id"), *args, **kwargs)

        return decorated

    def register_routes(self):
        @self.app.route("/login", methods=["POST"])
        def login():
            data = request.get_json()
            try:
                user = User(
                    email=data["email"],
                    password=data["password"]
                )
            except Exception as e:
                log_error(f"Error parsing user: {str(e)}")
                ex = BadRequest(ErrorType.PARSE_USER_ERROR)
                return jsonify(ex.to_dict()), ex.status

            try:
                token = self.login_use_case.login(user)
                return jsonify({"token": token}), 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/user", methods=["POST"])
        def create_user():
            data = request.get_json()
            try:
                user = User(
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    email=data["email"],
                    password=data["password"],
                    job_title=data["job_title"],
                    academic_title=data["academic_title"],
                    country=data["country"],
                    state=data["state"],
                    city=data["city"],
                    institution=data["institution"],
                )
            except Exception as e:
                log_error(f"Error parsing user: {str(e)}")
                ex = BadRequest(ErrorType.PARSE_USER_ERROR)
                return jsonify(ex.to_dict()), ex.status

            try:
                self.users_service.create_user(user)
                return jsonify(data), 201
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/user", methods=["GET"])
        @self.is_authorized
        def get_user(user_id):
            try:
                user = self.users_service.get_user(user_id)
                return jsonify(user.to_dict()), 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/user", methods=["PUT"])
        @self.is_authorized
        def update_user(user_id):
            data = request.get_json()
            try:
                user = self.users_service.update_user(user_id, data)
                return jsonify(user.to_dict()), 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/user", methods=["DELETE"])
        @self.is_authorized
        def delete_user(user_id):
            try:
                self.users_service.delete_user(user_id)
                return {}, 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/metrics", methods=["POST"])
        @self.is_authorized
        def track_metrics(user_id):
            data = request.get_json()
            try:
                self.metrics_use_case.track(data)
                return {}, 201
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/metrics", methods=["GET"])
        @self.is_authorized
        def search_metrics():
            _ = request.get_json()
            # offset, limit, parametro de busqueda
            try:
                self.metrics_use_case.search()
                return {}, 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

    def run(self, host, port):
        self.app.run(debug=True, host=host, port=port)
