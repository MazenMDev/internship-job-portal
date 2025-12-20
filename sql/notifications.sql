CREATE TABLE notifications (
    notif_id        INT AUTO_INCREMENT PRIMARY KEY,
    receiver_id     INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    sender_id  INT NOT NULL,
    sender_type     INT NOT NULL,
    receiver_type    INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
