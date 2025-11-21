CREATE TABLE job_skills(
    job_id INT(11) NOT NULL,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (job_id, skill),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);