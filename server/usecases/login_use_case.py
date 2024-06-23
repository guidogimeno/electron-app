import bcrypt
import jwt

from errors.api_exception import BadRequest
from errors.error_types import ErrorType
from logger.logger import log_error
from datetime import datetime, timezone, timedelta


class LogInUseCase:
    def __init__(self, db):
        self.db = db

    def login(self, user):
        db_user = self.db.get_user(user.username)
        if db_user is None:
            log_error(f"User: {user.username} not found")
            raise BadRequest(ErrorType.USER_NOT_FOUND)

        is_valid = self._check_password(user.password, db_user.password)
        if not is_valid:
            log_error(f"Invalid password for user: {user.username}")
            raise BadRequest(ErrorType.INVALID_USER_CREDENTIALS)

        return self._create_token(db_user.username)

    def _check_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password)

    def validate_token(self, token):
        try:
            jwt.decode(
                token,
                "secret",
                algorithms=["HS256"],
                options={"require": ["exp"]}
            )
        except jwt.ExpiredSignatureError:
            log_error("Token expired")
            raise BadRequest(ErrorType.UNAUTHORIZED)
        except Exception as e:
            log_error(f"Invalid token, error: {str(e)}")
            raise BadRequest(ErrorType.UNAUTHORIZED)

    def _create_token(self, username):
        # TODO: usar env variable para secreto y para algoritmo
        token = jwt.encode(
            {
                "username": username,
                "exp": datetime.now(timezone.utc) + timedelta(hours=12)
            },
            "secret",
            algorithm="HS256"
        )
        return token

    def _nowutc(self):
        now = datetime.now(timezone.utc)
        dt = datetime(
            year=now.year,
            month=now.month,
            day=now.day,
            hour=now.hour,
            minute=now.minute,
            second=now.second
        )
        return dt
