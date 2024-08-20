from flask import Flask, request, jsonify, make_response
from functools import wraps
from errors.api_exception import ApiException, BadRequest
from errors.error_types import ErrorType
from usecases.metrics_use_case import MetricsUseCase
from usecases.login_use_case import LogInUseCase
from usecases.users_service import SignUpUseCase
from domain.user import User
from domain.metric import Metric
from logger.logger import log_error, log_info
from database.sqlite import MySqlite

AUTH_HEADER = "x-auth-token"

app = Flask(__name__)

log_info("Connecting to DB...")
db = MySqlite()

log_info("Creating use cases...")
db = MySqlite()
login_use_case = LogInUseCase(db)
users_service = SignUpUseCase(db)
metrics_use_case = MetricsUseCase(db)


def is_authorized(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get(AUTH_HEADER)
        if token is None:
            ex = BadRequest(ErrorType.MISSING_AUTH_TOKEN)
            return jsonify(ex.to_dict()), ex.status

        try:
            decoded = login_use_case.validate_token(token)
        except ApiException as e:
            return jsonify(e.to_dict()), e.status

        return func(decoded.get("user_id"), *args, **kwargs)

    return decorated


@app.route("/login", methods=["POST"])
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
        token = login_use_case.login(user)
        return jsonify({"token": token}), 200
    except ApiException as e:
        return jsonify(e.to_dict()), e.status


@app.route("/user", methods=["POST"])
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
        users_service.create_user(user)
        return jsonify(data), 201
    except ApiException as e:
        return jsonify(e.to_dict()), e.status


@app.route("/user", methods=["GET"])
@is_authorized
def get_user(user_id):
    try:
        user = users_service.get_user(user_id)
        return jsonify(user.to_dict()), 200
    except ApiException as e:
        return jsonify(e.to_dict()), e.status


@app.route("/user", methods=["PUT"])
@is_authorized
def update_user(user_id):
    data = request.get_json()
    try:
        user = users_service.update_user(user_id, data)
        return jsonify(user.to_dict()), 200
    except ApiException as e:
        return jsonify(e.to_dict()), e.status


@app.route("/user", methods=["DELETE"])
@is_authorized
def delete_user(user_id):
    try:
        users_service.delete_user(user_id)
        return {}, 200
    except ApiException as e:
        return jsonify(e.to_dict()), e.status


@app.route("/metrics", methods=["POST"])
@is_authorized
def track_metrics(user_id):
    data = request.get_json()
    try:
        metric = Metric(
            sex=data["sex"],
            age=data["age"],
            country=data["country"],
            pain_level=data["pain_level"],
            site_of_pain=data["site_of_pain"],
            mos_since_symp=data["mos_since_symp"],
            sport=data["sport"],
            sport_level=data["sport_level"],
            flexion=data["flexion"],
            extension=data["extension"],
            internal_rotation=data["internal_rotation"],
            external_rotation=data["external_rotation"],
            craig_test=data["craig_test"],
            fadir=data["fadir"],
            faber=data["faber"],
            log_roll=data["log_roll"],
            ab_heer=data["ab_heer"],
        )
        try:
            metrics_use_case.track(metric)
            return jsonify(metric.to_dict()), 201
        except ApiException as e:
            return jsonify(e.to_dict()), e.status
    except Exception as e:
        log_error(f"Error parsing metric: {str(e)}")
        ex = BadRequest(ErrorType.PARSE_METRIC_ERROR)
        return jsonify(ex.to_dict()), ex.status


@app.route("/metrics", methods=["GET"])
@is_authorized
def download_metrics(_):
    try:
        csv_metrics = metrics_use_case.get_all()
        response = make_response(csv_metrics)
        response.headers["Content-Type"] = "text/csv"
        response.headers["Content-Disposition"] = "attachment; filename=metrics.csv"
        return response, 201
    except ApiException as e:
        return jsonify(e.to_dict()), e.status


@app.route("/ping", methods=["GET"])
def ping():
    return jsonify("pong"), 200


@app.route("/migrations", methods=["POST"])
def migrations():
    return jsonify(""), 201


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8080)
