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