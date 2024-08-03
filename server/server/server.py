from flask import Flask, request, jsonify
from functools import wraps

from errors.api_exception import ApiException, BadRequest
from errors.error_types import ErrorType
from usecases.login_use_case import LogInUseCase
from usecases.signup_use_case import SignUpUseCase
from domain.user import User
from logger.logger import log_error

AUTH_HEADER = "x-auth-token"


class Server:
    def __init__(self, db):
        self.app = Flask(__name__)
        self.db = db
        self.login_use_case = LogInUseCase(db)
        self.signup_use_case = SignUpUseCase(db)
        self.register_routes()

    def is_authorized(self, func):
        @wraps(func)
        def decorated(*args, **kwargs):
            token = request.headers.get(AUTH_HEADER)
            if token is None:
                ex = BadRequest(ErrorType.MISSING_AUTH_TOKEN)
                return jsonify(ex.to_dict()), ex.status

            try:
                self.login_use_case.validate_token(token)
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

            return func(*args, **kwargs)

        return decorated

    def register_routes(self):
        @self.app.route("/login", methods=["POST"])
        def login():
            data = request.get_json()
            user = _decode_user(data)
            try:
                token = self.login_use_case.login(user)
                return jsonify({"token": token}), 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/signup", methods=["POST"])
        def signup():
            data = request.get_json()
            user = _decode_user(data)
            try:
                self.signup_use_case.signup(user)
                return jsonify(data), 201
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

        @self.app.route("/user", methods=["GET"])
        @self.is_authorized
        def get_user():
            token = request.headers.get(AUTH_HEADER)
            try:
                user = self.login_use_case.get_user(token)
                return jsonify(user.to_dict()), 200
            except ApiException as e:
                return jsonify(e.to_dict()), e.status

    def run(self, host, port):
        self.app.run(debug=True, host=host, port=port)


def _decode_user(data):
    try:
        return User(
            username=data["username"],
            password=data["password"]
        )
    except Exception as e:
        log_error(f"Error parsing user: {str(e)}")
        ex = BadRequest(ErrorType.PARSE_USER_ERROR)
        return jsonify(ex.to_dict()), ex.status
