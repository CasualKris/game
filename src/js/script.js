const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const segmentSize = 20;
let snakeSegments = [{ x: 20, y: 20 }];
let direction = 'right';
let food = { x: 500, y: 300 };
let bonus = null;
let speed = 150; 
let speedIncrement = 5; 
let lastTime = 0;

let score = 0;

function addHighScoreToServer(playerName, score) {
    fetch('highscores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `playerName=${encodeURIComponent(playerName)}&score=${encodeURIComponent(score)}`,
    })
    .then(response => response.json())
    .then(data => {
        console.log('High score added:', data);
        window.location.href = 'leaderboard.html';
    })
    .catch(error => {
        console.error('Error adding high score:', error);
        window.location.href = 'leaderboard.html'; // Redirect to leaderboard even if there is an error
    });
}

function initGame() {
    requestAnimationFrame(update);
}

function update(currentTime) {
    const deltaTime = currentTime - lastTime;
    if (deltaTime > speed) {
        lastTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, segmentSize, segmentSize);

        if (bonus) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(bonus.x, bonus.y, segmentSize, segmentSize);
        }

        drawSnake();
        moveSnake();

        if (snakeSegments[0].x === food.x && snakeSegments[0].y === food.y) {
            snakeSegments.push({});
            generateFood();
            score += 100;

            speed -= speedIncrement;
        }

        if (bonus && snakeSegments[0].x === bonus.x && snakeSegments[0].y === bonus.y) {
            score += 100;
            bonus = null;
        }

        if (snakeSegments[0].x < 0 || snakeSegments[0].x >= canvas.width || snakeSegments[0].y < 0 || snakeSegments[0].y >= canvas.height) {
            gameOver();
            return;
        }

        for (let i = 1; i < snakeSegments.length; i++) {
            if (snakeSegments[0].x === snakeSegments[i].x && snakeSegments[0].y === snakeSegments[i].y) {
                gameOver();
                return;
            }
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText("Score: " + score, canvas.width - 10, canvas.height - 10);
    }

    requestAnimationFrame(update);
}

function drawSnake() {
    snakeSegments.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
            drawEye(segment.x, segment.y);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
        }
    });
}

function drawEye(x, y) {
    ctx.fillStyle = 'red';
    const eyeRadius = 3;
    let eyeX, eyeY;

    if (direction === 'up') {
        eyeX = x + segmentSize / 2;
        eyeY = y + segmentSize / 4;
    } else if (direction === 'down') {
        eyeX = x + segmentSize / 2;
        eyeY = y + (3 * segmentSize) / 4;
    } else if (direction === 'left') {
        eyeX = x + segmentSize / 4;
        eyeY = y + segmentSize / 2;
    } else if (direction === 'right') {
        eyeX = x + (3 * segmentSize) / 4;
        eyeY = y + segmentSize / 2;
    }

    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function moveSnake() {
    const head = { x: snakeSegments[0].x, y: snakeSegments[0].y };
    if (direction === 'up') head.y -= segmentSize;
    if (direction === 'down') head.y += segmentSize;
    if (direction === 'left') head.x -= segmentSize;
    if (direction === 'right') head.x += segmentSize;

    snakeSegments.unshift(head);
    snakeSegments.pop();
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / segmentSize)) * segmentSize;
    food.y = Math.floor(Math.random() * (canvas.height / segmentSize)) * segmentSize;
}

function gameOver() {
    const playerName = document.getElementById('playerName').value;
    addHighScoreToServer(playerName, score);
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if ((key === 'ArrowUp' || key === 'w') && direction !== 'down') direction = 'up';
    if ((key === 'ArrowDown' || key === 's') && direction !== 'up') direction = 'down';
    if ((key === 'ArrowLeft' || key === 'a') && direction !== 'right') direction = 'left';
    if ((key === 'ArrowRight' || key === 'd') && direction !== 'left') direction = 'right';
});

requestAnimationFrame(update);
