import sqlite3

from domain.user import User
from errors.api_exception import InternalServerError
from errors.error_types import ErrorType
from logger.logger import log_error


class MySqlite:
    def __init__(self):
        self.database_file = "./.database.db"

    def get_user_by_name(self, username):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """SELECT id, username, password, email, is_active
                    FROM users WHERE username = ?""",
                    (username,)
                )
                data = cursor.fetchone()
            if data:
                return User(
                    id=data[0],
                    username=data[1],
                    password=data[2],
                    email=data[3],
                    is_active=data[4]
                )
            return None
        except Exception as e:
            log_error(f"DB: failed to get user by name: {
                      username}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def get_user(self, user_id):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """SELECT id, username, password, email, is_active
                    FROM users WHERE id = ?""",
                    (user_id,)
                )
                data = cursor.fetchone()
            if data:
                return User(
                    id=data[0],
                    username=data[1],
                    password=data[2],
                    email=data[3],
                    is_active=data[4]
                )
            return None
        except Exception as e:
            log_error(f"DB: failed to get user by id: {
                      user_id}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def save_user(self, user):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """INSERT INTO users (username, password, email)
                    VALUES (?, ?, ?)""",
                    (user.username, user.password, user.email)
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to save user {
                      user.username}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def update_user(self, user_id, user):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """UPDATE users SET username = ?, email = ?, password = ?
                    WHERE id = ?""",
                    (user.username, user.email, user.password, user_id)
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to update user {
                      user.username}, error: {str(e)}")
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
