<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "snake";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $playerName = $_POST['playerName'];
    $score = $_POST['score'];

    $stmt = $conn->prepare("INSERT INTO highscores (playerName, score) VALUES (?, ?)");
    $stmt->bind_param("si", $playerName, $score);

    if ($stmt->execute()) {
        echo json_encode(["message" => "High score added successfully"]);
    } else {
        echo json_encode(["error" => "Error adding high score"]);
    }

    $stmt->close();
}

$conn->close();
?>
