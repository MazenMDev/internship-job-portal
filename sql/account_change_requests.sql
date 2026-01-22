CREATE TABLE account_change_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    company_id INT NULL,
    change_type VARCHAR(20) NOT NULL,
    token VARCHAR(255) NOT NULL,
    new_email VARCHAR(150) NULL,
    new_email_token VARCHAR(255) NULL,
    new_email_verified BOOLEAN DEFAULT FALSE,
    old_email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(Id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);
