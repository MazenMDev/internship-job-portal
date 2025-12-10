CREATE TABLE job_bookmarks(
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id)
)