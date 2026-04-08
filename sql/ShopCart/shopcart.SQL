CREATE DATABASE shopcart;

USE shopcart;

CREATE TABLE produkti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nosaukums VARCHAR(100),
    cena DECIMAL(10,2),
    attels VARCHAR(255)
);

CREATE TABLE grozs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produkts_id INT,
    daudzums INT,
    session_id VARCHAR(100)
);