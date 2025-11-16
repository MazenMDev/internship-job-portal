CREATE TABLE company(
	user_id INT(11) NOT NULL PRIMARY KEY,
    company_email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
	company_name VARCHAR(250) NOT NULL,
    country VARCHAR(250) NOT NULL,
    city VARCHAR(250) NOT NULL,
    state VARCHAR(100) NOT NULL,
    street_address VARCHAR(250) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    company_url VARCHAR(255) NOT NULL,
    user_position VARCHAR(255) NOT NULL,
    description VARCHAR(500) ,
    FOREIGN KEY (user_id) REFERENCES users(Id) ON DELETE CASCADE
    	
);