CREATE TABLE users (
    Id INT(11) NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Gender VARCHAR(6) NOT NULL,
    Image VARCHAR(255) DEFAULT 'profile.jpeg',
    Title VARCHAR(150) DEFAULT NULL,
    Bio TEXT DEFAULT NULL,
    Major VARCHAR(100) DEFAULT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    theme VARCHAR(20) DEFAULT 'light',
    cv VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    institution VARCHAR(255),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    description TEXT
);

CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    institution VARCHAR(255),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    description TEXT
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    institution VARCHAR(255),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    description TEXT
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    link VARCHAR(255),
    description TEXT
);

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill VARCHAR(255),
    info TEXT
);
