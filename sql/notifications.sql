CREATE TABLE notifications (
    notif_id        INT AUTO_INCREMENT PRIMARY KEY,
    receiver_id     INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    sender_id  INT NOT NULL,
    sender_type     VARCHAR(20) NOT NULL,
    receiver_type    VARCHAR(20) NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
);
