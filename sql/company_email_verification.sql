CREATE TABLE company_email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);
