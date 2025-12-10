CREATE TABLE notifications (
    notif_id        INT AUTO_INCREMENT PRIMARY KEY,
    receiver_id     INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    form_sender_id  INT NOT NULL,
    user_sender_id  INT NOT NULL,
    sender_type     VARCHAR(20) NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receiver_id) REFERENCES users(Id),
    FOREIGN KEY (form_sender_id) REFERENCES company(user_id),
    FOREIGN KEY (user_sender_id) REFERENCES users(Id)
);
