CREATE TABLE job_tags(
    job_id INT(11) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (job_id, tag),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);