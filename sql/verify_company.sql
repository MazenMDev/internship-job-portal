CREATE TABLE verify_company(
    verification_id INT PRIMARY KEY AUTO_INCREMENT,
    is_verified BOOLEAN DEFAULT FALSE,
    
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    company_phone VARCHAR(20) NOT NULL,
    company_address VARCHAR(250) NOT NULL,
    company_city VARCHAR(100) NOT NULL,
    company_state VARCHAR(100) NOT NULL,
    company_zip VARCHAR(20) NOT NULL,
    company_country VARCHAR(100) NOT NULL,
    company_website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);