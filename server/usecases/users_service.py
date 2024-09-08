import bcrypt

from errors.api_exception import BadRequest
from errors.error_types import ErrorType
from logger.logger import log_error


class SignUpUseCase:
    def __init__(self, db):
        self.db = db

    def create_user(self, user):
        db_user = self.db.get_user_by_email(user.email)
        if db_user is not None:
            log_error(f"User: {user.email} already exists")
            raise BadRequest(ErrorType.USER_ALREADY_EXISTS)

        user.password = self._hash_password(user.password)
        self.db.save_user(user)

    def get_user(self, user_id):
        db_user = self.db.get_user(user_id)
        if db_user is None:
            log_error(f"User: {user_id} not found")
            raise BadRequest(ErrorType.USER_NOT_FOUND)
        if not db_user.is_active:
            log_error(f"User: {user_id} is not active")
            raise BadRequest(ErrorType.USER_NOT_ACTIVE)

        return db_user

    def update_user(self, user_id, updated_user):
        db_user = self.db.get_user(user_id)
        if db_user is None:
            log_error(f"User: {user_id} not found")
            raise BadRequest(ErrorType.USER_NOT_FOUND)

        db_user.first_name = updated_user.get("first_name", db_user.first_name)
        db_user.last_name = updated_user.get("last_name", db_user.last_name)
        db_user.email = updated_user.get("email", db_user.email)
        db_user.job_title = updated_user.get("job_title", db_user.job_title)
        db_user.academic_title = updated_user.get("academic_title", db_user.academic_title)
        db_user.country = updated_user.get("country", db_user.country)
        db_user.state = updated_user.get("state", db_user.state)
        db_user.city = updated_user.get("city", db_user.city)
        db_user.institution = updated_user.get("institution", db_user.institution)
        password = updated_user.get("password", None)
        if password:
            db_user.password = self._hash_password(password)

        self.db.update_user(user_id, db_user)

        return db_user

    def delete_user(self, user_id):
        self.db.delete_user(user_id)

    def _hash_password(self, password):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
