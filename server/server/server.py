from flask import Flask, request, jsonify

from errors.api_exception import ApiException, BadRequest
from errors.error_types import ErrorType
from usecases.login_use_case import LogInUseCase
from usecases.signup_use_case import SignUpUseCase
from domain.user import User
from logger.logger import log_error

class Server:
    def __init__(self, db):
        self.app = Flask(__name__)
        self.db = db
        self.login_use_case = LogInUseCase(db)
        self.signup_use_case = SignUpUseCase(db)
        self.register_routes()

    def register_routes(self):
        @self.app.route("/login", methods=["POST"])
        def login():
            data = request.get_json()
            user = _decode_user(data)
            try:
                token = self.login_use_case.login(user)
                return jsonify({ "token": token }), 200
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

    def run(self, host, port):
        self.app.run(debug=True, host=host, port=port)

def _decode_user(data):
    try:
        return User(**data)
    except Exception as e:
        log_error(f"Error parsing user: {str(e)}")
        ex = BadRequest(ErrorType.PARSE_USER_ERROR)
        return jsonify(ex.to_dict()), ex.status
