import bcrypt
import secrets

from errors.api_exception import BadRequest
from errors.error_types import ErrorType
from logger.logger import log_error
from datetime import datetime, timezone


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

        token = self._create_token(db_user.id)
        self.db.save_token(db_user.id, token)
        return token

    def _check_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password)

    def validate_token(self, token):
        user_id = token[:token.index(".")]
        session = self.db.get_user_session(user_id)
        if (session is None or
            session.token != token or
                session.expires_at < self._nowutc()):
            log_error(f"Invalid token: {token} for user {user_id}")
            raise BadRequest(ErrorType.UNAUTHORIZED)

    def _create_token(self, user_id):
        timestamp = self._nowutc().strftime("%Y-%m-%dT%H:%M:%SZ")
        random_part = secrets.token_urlsafe(32)
        token = f"{user_id}.{timestamp}.{random_part}"
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
