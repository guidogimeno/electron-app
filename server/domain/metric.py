from dataclasses import dataclass


@dataclass
class Metric:
    sex: str
    age: int
    country: str
    pain_level: int
    site_of_pain: str
    mos_since_symp: int
    sport: str
    sport_level: str
    flexion: int
    extension: int
    internal_rotation: int
    external_rotation: int
    craig_test: int
    fadir: str
    faber: str
    log_roll: str
    ab_heer: str

    def to_dict(self):
        return {
            "sex": self.sex,
            "age": self.age,
            "country": self.country,
            "pain_level": self.pain_level,
            "site_of_pain": self.site_of_pain,
            "mos_since_symp": self.mos_since_symp,
            "sport": self.sport,
            "sport_level": self.sport_level,
            "flexion": self.flexion,
            "extension": self.extension,
            "internal_rotation": self.internal_rotation,
            "external_rotation": self.external_rotation,
            "craig_test": self.craig_test,
            "fadir": self.fadir,
            "faber": self.faber,
            "log_roll": self.log_roll,
            "ab_heer": self.ab_heer
        }
