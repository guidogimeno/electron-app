import sqlite3
import csv
import io

from domain.user import User
from errors.api_exception import InternalServerError
from errors.error_types import ErrorType
from logger.logger import log_error


class MySql:
    def __init__(self):
        self.database_file = "./.database.db"

    def get_user(self, user_id):
        return self._get_user_by("id", user_id)

    def get_user_by_email(self, email):
        return self._get_user_by("email", email)

    def _get_user_by(self, field, value):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    f"""SELECT
                    id,
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
                    WHERE {field} = ?""",
                    (value,)
                )
                data = cursor.fetchone()
            if data:
                return User(
                    id=data[0],
                    first_name=data[1],
                    last_name=data[2],
                    job_title=data[3],
                    password=data[4],
                    academic_title=data[5],
                    email=data[6],
                    country=data[7],
                    state=data[8],
                    city=data[9],
                    institution=data[10],
                    is_active=data[11],
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
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
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
                    institution = ?
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

    def save_metric(self, metric):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """INSERT INTO metrics (
                        sex,
                        age,
                        country,
                        pain_level,
                        site_of_pain,
                        mos_since_symp,
                        sport,
                        sport_level,
                        flexion,
                        extension,
                        internal_rotation,
                        external_rotation,
                        craig_test,
                        fadir,
                        faber,
                        log_roll,
                        ab_heer
                    )
                    VALUES (
                        ? ,? ,? ,? ,? ,? ,? ,? ,? ,
                        ? ,? ,? ,? ,? ,? ,? ,?
                    )""",
                    (
                        metric.sex,
                        metric.age,
                        metric.country,
                        metric.pain_level,
                        metric.site_of_pain,
                        metric.mos_since_symp,
                        metric.sport,
                        metric.sport_level,
                        metric.flexion,
                        metric.extension,
                        metric.internal_rotation,
                        metric.external_rotation,
                        metric.craig_test,
                        metric.fadir,
                        metric.faber,
                        metric.log_roll,
                        metric.ab_heer
                    )
                )
                conn.commit()
        except Exception as e:
            log_error(f"DB: failed to save metric, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

    def get_all_metrics(self):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM metrics")
                conn.commit()

                data = cursor.fetchmany(1000)
                if not data:
                    return None

                columns = [description[0]
                           for description in cursor.description]

                csv_buffer = io.StringIO()
                csv_writer = csv.writer(csv_buffer)
                csv_writer.writerow(columns)
                csv_writer.writerows(data)

                return csv_buffer.getvalue()

        except Exception as e:
            log_error(f"DB: failed to get all metrics, error: {str(e)}")
            raise InternalServerError(ErrorType.DB_ERROR)

        def close(self):
            with sqlite3.connect(self.database_file) as conn:
                conn.close()

        def __exit__(self, exc_type, exc_val, exc_tb):
            self.close()
