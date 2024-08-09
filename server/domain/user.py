from dataclasses import dataclass


@dataclass
class User:
    id: int = 0
    username: str = ""
    password: str = ""
    email: str = ""
    is_active: bool = True

    def to_dict(self):
        return {
            "username": self.username,
            "password": "*****",
            "email": self.email
        }
