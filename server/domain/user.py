from dataclasses import dataclass


@dataclass
class User:
    id: int = None
    first_name: str = None
    last_name: str = None
    email: str = None
    password: str = None
    job_title: str = None
    academic_title: str = None
    country: str = None
    state: str = None
    city: str = None
    institution: str = None
    is_active: bool = None

    def to_dict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "job_title": self.job_title,
            "academic_title": self.academic_title,
            "country": self.country,
            "state": self.state,
            "city": self.city,
            "institution": self.institution
        }
