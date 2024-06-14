let highScores = [
    { name: "Player 1", score: 500 },
    { name: "Player 2", score: 400 },
    { name: "Player 3", score: 300 },
    { name: "Player 4", score: 200 },
    { name: "Player 5", score: 100 }
];

function displayHighScores() {
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = ''; // Clear existing list

    highScores.forEach((scoreObj, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${scoreObj.name} - ${scoreObj.score}`;
        highScoresList.appendChild(li);
    });
}

function addHighScore(playerName, score) {
    const newScore = { name: playerName, score: score };
    highScores.push(newScore);
    // Sorteer scores
    highScores.sort((a, b) => b.score - a.score);
    // Toon alleen de hoogste 10 scores
    highScores = highScores.slice(0, 10);
}

displayHighScores();
