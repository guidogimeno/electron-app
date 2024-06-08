class ApiException(Exception):
    def __init__(self, status, error):
        self.status = status
        self.code = error.value[0]
        self.message = error.value[1]
        super().__init__(self.message)

    def to_dict(self):
        return {"code": self.code, "message": self.message}


class BadRequest(ApiException):
    def __init__(self, error):
        super().__init__(400, error)


class Unauthorized(ApiException):
    def __init__(self, error):
        super().__init__(401, error)


class InternalServerError(ApiException):
    def __init__(self, error):
        super().__init__(500, error)
