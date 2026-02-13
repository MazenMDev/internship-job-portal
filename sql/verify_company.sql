CREATE TABLE verify_company (
    verification_id INT PRIMARY KEY AUTO_INCREMENT,
    is_verified BOOLEAN DEFAULT FALSE,
    company_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);
