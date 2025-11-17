CREATE TABLE company (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL,
    message VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_Id INT FOREIGN KEY REFERENCES users(Id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);