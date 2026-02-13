drop table notifications;

--CREATE TABLE notifications (
-- notif_id        INT AUTO_INCREMENT PRIMARY KEY,
-- receiver_id     INT NOT NULL,
-- title           VARCHAR(255) NOT NULL,
-- description     TEXT,
-- sender_id  INT NOT NULL,
-- sender_type     INT NOT NULL,
-- seen INT DEFAULT 0,
-- receiver_type    INT NOT NULL,
-- created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--);

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

ALTER TABLE email_verifications DROP COLUMN First_Name;
ALTER TABLE email_verifications DROP COLUMN Last_Name;
ALTER TABLE email_verifications DROP COLUMN Email;
ALTER TABLE email_verifications DROP COLUMN Password;
ALTER TABLE email_verifications DROP COLUMN Gender;

ALTER TABLE company_email_verifications DROP COLUMN company_name;
ALTER TABLE company_email_verifications DROP COLUMN company_email;
ALTER TABLE company_email_verifications DROP COLUMN password;
ALTER TABLE company_email_verifications DROP COLUMN company_phone;
ALTER TABLE company_email_verifications DROP COLUMN company_address;
ALTER TABLE company_email_verifications DROP COLUMN company_city;
ALTER TABLE company_email_verifications DROP COLUMN company_state;
ALTER TABLE company_email_verifications DROP COLUMN company_zip;
ALTER TABLE company_email_verifications DROP COLUMN company_country;
ALTER TABLE company_email_verifications DROP COLUMN company_website;

DROP TABLE verify_company;

CREATE TABLE verify_company (
    verification_id INT PRIMARY KEY AUTO_INCREMENT,
    is_verified BOOLEAN DEFAULT FALSE,
    company_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
);
