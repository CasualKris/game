CREATE TABLE highscores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playerName VARCHAR(50) NOT NULL,
    score INT NOT NULL
);

INSERT INTO highscores (playerName, score) VALUES 
('Alice', 1500),
('Bob', 1200),
('Charlie', 900),
('David', 1800),
('Eve', 1100),
('Frank', 1600),
('Grace', 1300),
('Heidi', 1700);
