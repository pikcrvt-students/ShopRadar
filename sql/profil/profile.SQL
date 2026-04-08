CREATE DATABASE profilsistema;

USE profilsistema;

CREATE TABLE lietotaji (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lietotajvards VARCHAR(50) NOT NULL,
    epasts VARCHAR(100) NOT NULL,
    parole VARCHAR(255) NOT NULL,
    izveidots TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);