CREATE DATABASE IF NOT EXISTS app_db;
USE app_db;

-- Table for Part 1 Requirement 2
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Table for Part 1 Requirement 3 (Token Management)
CREATE TABLE IF NOT EXISTS user_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create a default user as required [cite: 36]
INSERT IGNORE INTO users (username, password) VALUES ('admin', '123');