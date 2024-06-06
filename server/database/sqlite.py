import sqlite3

from domain.user import User
from domain.session import Session
from errors.api_exception import InternalServerError
from errors.error_types import ErrorType
from logger.logger import log_error
from datetime import datetime, timedelta, timezone

class MySqlite:
    def __init__(self):
        self.database_file = "./.database.db"
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)")
            conn.commit()

    def get_user(self, username):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT id, username, password FROM users WHERE username = ?", (username,))
                data = cursor.fetchone()
            if data:
                return User(*data)
            else:
                return None 
        except Exception as e:
            log_error(f"DB: failed to get user: {username}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def get_user_session(self, user_id):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                        "SELECT token, expires_at FROM user_sessions WHERE user_id = ?",
                        (user_id,)
                )
                data = cursor.fetchone()
            if data:
                return Session(
                        token=data[0],
                        expires_at=datetime.fromisoformat(data[1])                )
            else:
                return None 
        except Exception as e:
            log_error(f"DB: failed to get session for: {user_id}, error: {str(e)}")
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
            log_error(f"DB: failed to save user {user.username}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def save_token(self, user_id, token):
        expires_at = datetime.now(timezone.utc) + timedelta(hours=12)
        sql = f"""INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)
        ON CONFLICT (user_id) DO UPDATE SET token = excluded.token, expires_at = excluded.expires_at;"""
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(sql, (user_id, token, expires_at))
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to save token for user {user_id}, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)


    def close(self):
        with sqlite3.connect(self.database_file) as conn:
            conn.close()

