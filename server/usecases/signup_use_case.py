import bcrypt

from errors.api_exception import BadRequest 
from errors.error_types import ErrorType
from logger.logger import log_error

class SignUpUseCase:
    def __init__(self, db):
        self.db = db

    def signup(self, user):
        user.password = self._hash_password(user.password)

        db_user = self.db.get_user(user.username)
        if db_user is not None:
            log_error(f"User: {user.username} already exists")
            raise BadRequest(ErrorType.USER_ALREADY_EXISTS)

        self.db.create_user(user)

    def _hash_password(self, password):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        
