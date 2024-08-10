from dataclasses import dataclass


@dataclass
class User:
    id: int
    first_name: str
    last_name: str
    email: str
    password: str
    job_title: str
    academic_title: str
    country: str
    state: str
    city: str
    institution: str
    is_active: bool

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
