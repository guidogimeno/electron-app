import sqlite3

from domain.user import User
from errors.api_exception import InternalServerError
from errors.error_types import ErrorType
from logger.logger import log_error


class MySqlite:
    def __init__(self):
        self.database_file = "./.database.db"

    def get_user(self, user_id):
        return self._get_user_by("user_id", user_id)

    def get_user_by_email(self, email):
        return self._get_user_by("email", email)

    def _get_user_by(self, field, value):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    f"""SELECT
                    first_name,
                    last_name,
                    job_title,
                    password,
                    academic_title,
                    email,
                    country,
                    state,
                    city,
                    institution,
                    is_active
                    FROM users
                    WHERE {id} = ?""",
                    (value,)
                )
                data = cursor.fetchone()
            if data:
                return User(
                    first_name=data[0],
                    last_name=data[1],
                    job_title=data[2],
                    password=data[3],
                    academic_title=data[4],
                    email=data[5],
                    country=data[6],
                    state=data[7],
                    city=data[8],
                    institution=data[9],
                    is_active=data[10],
                )
            return None
        except Exception as e:
            log_error(f"DB: failed to get user by {field}: {
                      value}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def save_user(self, user):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """INSERT INTO users (
                    first_name,
                    last_name,
                    job_title,
                    password,
                    academic_title,
                    email,
                    country,
                    state,
                    city,
                    institution)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        user.first_name,
                        user.last_name,
                        user.job_title,
                        user.password,
                        user.academic_title,
                        user.email,
                        user.country,
                        user.state,
                        user.city,
                        user.institution,
                    )
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to save user {user.email}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def update_user(self, user_id, user):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """UPDATE users SET
                    first_name = ?,
                    last_name = ?,
                    job_title = ?,
                    password = ?,
                    academic_title = ?,
                    email = ?,
                    country = ?,
                    state = ?,
                    city = ?,
                    institution = ?,
                    WHERE id = ?""",
                    (
                        user.first_name,
                        user.last_name,
                        user.job_title,
                        user.password,
                        user.academic_title,
                        user.email,
                        user.country,
                        user.state,
                        user.city,
                        user.institution,
                        user_id
                    )
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to update user {
                      user.email}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def delete_user(self, user_id):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE users SET is_active = false WHERE id = ?",
                    (user_id,)
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to delete user {
                      user_id}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def close(self):
        with sqlite3.connect(self.database_file) as conn:
            conn.close()
