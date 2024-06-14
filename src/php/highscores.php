<?php
$dbHost = 'localhost'; 
$dbUser = 'root';
$dbPass = '';
$dbName = 'snake';

// Maak verbinding met de database
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

// Controleer de verbinding
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['playerName']) && isset($_POST['score'])) {
    $playerName = $_POST['playerName'];
    $score = $_POST['score'];

    // SQL query om high score toe te voegen
    $sql = "INSERT INTO highscores (playerName, score) VALUES ('$playerName', '$score')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('message' => 'High'));
    } else {
        echo json_encode(array('error' => ': ' . $conn->error));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //top 10 scores
    $sql = "SELECT playerName, score FROM highscores ORDER BY score DESC LIMIT 10";
    $result = $conn->query($sql);

    $highScores = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $highScores[] = $row;
        }
    }

    echo json_encode($highScores);
}

// Sluit de database verbinding
$conn->close();
?>
