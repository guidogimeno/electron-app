from enum import Enum


class ErrorType(Enum):
    USER_NOT_FOUND = (1, "User not found")
    USER_ALREADY_EXISTS = (2, "User already exists")
    USER_NOT_ACTIVE = (3, "User not found")
    INVALID_USER_CREDENTIALS = (4, "Invalid user credentials")
    DB_ERROR = (5, "Error executing query to the db")
    PARSE_USER_ERROR = (6, "Error parsing user")
    UNAUTHORIZED = (7, "Unauthorized")
    MISSING_AUTH_TOKEN = (8, "Missing auth token")
