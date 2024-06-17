function fetchHighScores() {
    fetch('http://localhost:8889/src/php/highscores.php')
        .then(response => response.json())
        .then(data => {
            console.log('High scores fetched:', data);
            // Verwerk de ontvangen data (bijvoorbeeld in een lijst op de pagina)
            displayHighScores(data);
        })
        .catch(error => {
            console.error('Error fetching high scores:', error);
        });
}

function displayHighScores(highScores) {
    // Verwerk de ontvangen high scores en toon ze op de pagina
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = ''; // Wis de huidige inhoud

    highScores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = `${score.playerName}: ${score.score}`;
        highScoresList.appendChild(listItem);
    });
}

// Roep de functie aan om highscores op te halen en te tonen
fetchHighScores();
