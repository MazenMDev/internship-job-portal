CREATE TABLE company_email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    company_phone VARCHAR(20) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    company_city VARCHAR(100) NOT NULL,
    company_state VARCHAR(100) NOT NULL,
    company_zip VARCHAR(20) NOT NULL,
    company_country VARCHAR(100) NOT NULL,
    company_website VARCHAR(255) NOT NULL
);
