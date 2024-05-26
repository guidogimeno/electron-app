import bcrypt

from errors.api_exception import BadRequest
from errors.error_types import ErrorType
from logger.logger import log_error

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

        return "token1234"

    def _check_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password)

