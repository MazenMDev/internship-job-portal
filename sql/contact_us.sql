CREATE TABLE contact_us (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL,
    message VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_Id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_Id) REFERENCES users(Id)
    
);