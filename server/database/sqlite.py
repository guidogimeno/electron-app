import sqlite3

from domain.user import User

class MySqlite():
    def __init__(self):
        self.database_file = "./database.db"
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)")
            conn.commit()

    def get_user(self, username):
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT username, password FROM users WHERE username = ?", (username,))
            data = cursor.fetchone()
        if data:
            return User(*data)
        else:
            return None 

    def create_user(self, user):
        with sqlite3.connect(self.database_file) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users VALUES (?, ?)", (user["username"], user["password"]))
            conn.commit()

    def close(self):
        with sqlite3.connect(self.database_file) as conn:
            conn.close()
