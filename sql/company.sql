CREATE TABLE company(
    company_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(250) NOT NULL,
    company_email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    street_address VARCHAR(250) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    company_url VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);