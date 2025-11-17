CREATE TABLE jobs(
    job_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    company_id INT(11) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    salary_min INT(11),
    salary_max INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company(user_id) ON DELETE CASCADE
);