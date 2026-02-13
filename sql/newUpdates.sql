drop table notifications;


CREATE TABLE notifications (
    notif_id INT AUTO_INCREMENT PRIMARY KEY,
    
    receiver_type INT NOT NULL,
    sender_type INT NOT NULL,
    
    sender_user_id INT NULL,
    sender_company_id INT NULL,
    sender_job_id INT NULL,
    
    receiver_user_id INT NULL,
    receiver_company_id INT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    seen INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_user_id) REFERENCES users(id),
     
    FOREIGN KEY (sender_company_id) REFERENCES company(company_id),
    FOREIGN KEY (sender_job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (receiver_user_id) REFERENCES users(id),
    FOREIGN KEY (receiver_company_id) REFERENCES company(company_id)

);

ALTER TABLE users
ADD email_verified INT DEFAULT 0;

ALTER TABLE company
ADD company_verified INT DEFAULT 0;


drop table email_verifications;
CREATE TABLE email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(Id)
);


drop table company_email_verifications;
CREATE TABLE company_email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);



DROP TABLE verify_company;

CREATE TABLE verify_company (
    verification_id INT PRIMARY KEY AUTO_INCREMENT,
    is_verified BOOLEAN DEFAULT FALSE,
    company_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);
