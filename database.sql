CREATE DATABASE reconnecting;
USE reconnecting;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `username`VARCHAR(100),
    `name` VARCHAR(100),
    `password` VARCHAR(200),
    `school` VARCHAR(200),
    `interests` VARCHAR(200),
    `hometown` VARCHAR(200)
    );

--INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');