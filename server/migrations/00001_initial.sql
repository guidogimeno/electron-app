CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    password TEXT NOT NULL,
    academic_title TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    institution TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sex TEXT NOT NULL,
    age INT NOT NULL,
    country TEXT NOT NULL,
    pain_level INT NOT NULL,
    site_of_pain TEXT NOT NULL,
    mos_since_symp INT NOT NULL,
    sport TEXT NOT NULL,
    sport_level TEXT NOT NULL,
    flexion INT NOT NULL,
    extension INT NOT NULL,
    internal_rotation INT NOT NULL,
    external_rotation INT NOT NULL,
    craig_test INT NOT NULL,
    fadir TEXT NOT NULL,
    faber TEXT NOT NULL,
    log_roll TEXT NOT NULL,
    ab_heer TEXT NOT NULL
);
