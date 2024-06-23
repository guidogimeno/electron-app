import sqlite3

from domain.user import User
from errors.api_exception import InternalServerError
from errors.error_types import ErrorType
from logger.logger import log_error


class MySqlite:
    def __init__(self):
        self.database_file = "./.database.db"

    def get_user(self, username):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT username, password FROM users WHERE username = ?",
                    (username,)
                )
                data = cursor.fetchone()
            if data:
                return User(*data)
            return None
        except Exception as e:
            log_error(f"DB: failed to get user: {username}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def save_user(self, user):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO users (username, password) VALUES (?, ?)",
                    (user.username, user.password)
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to save user {
                      user.username}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def close(self):
        with sqlite3.connect(self.database_file) as conn:
            conn.close()
