from enum import Enum


class ErrorType(Enum):
    USER_NOT_FOUND = (1, "User not found")
    USER_ALREADY_EXISTS = (2, "User already exists")
    INVALID_USER_CREDENTIALS = (3, "Invalid user credentials")
    DB_ERROR = (4, "Error executing query to the db")
    PARSE_USER_ERROR = (5, "Error parsing user")
    UNAUTHORIZED = (6, "Unauthorized")
    MISSING_AUTH_TOKEN = (7, "Missing auth token")
