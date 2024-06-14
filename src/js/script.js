const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const segmentSize = 20;
let snakeSegments = [{ x: 20, y: 20 }];
let direction = 'right';
let food = { x: 500, y: 300 };
let bonus = null; // Bonus verschijnt nog niet
let speed = 150; 
let speedIncrement = 5; 
let lastTime = 0;

let score = 0;
let highScore = 0;
let foodCounter = 0; // Teller voor rode pellets

function initGame() {
    requestAnimationFrame(update);
}

function update(currentTime) {
    const deltaTime = currentTime - lastTime;
    if (deltaTime > speed) {
        lastTime = currentTime; 

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Teken voedsel
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, segmentSize, segmentSize);

        // Teken bonus
        if (bonus) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(bonus.x, bonus.y, segmentSize, segmentSize);
        }

        // Teken de slang
        drawSnake();
        moveSnake();

        // Controleer of de slang het voedsel heeft bereikt
        if (snakeSegments[0].x === food.x && snakeSegments[0].y === food.y) {
            // Voeg een segment toe aan de slang
            snakeSegments.push({});
            generateFood();
            score += 100;

            // Voedsel teller + geeft bonus
            foodCounter++;
            if (foodCounter >= 3 && foodCounter % 2 === 1) {
                generateBonus();
            }
            speed -= speedIncrement;
        }

        // Bonus
        if (bonus && snakeSegments[0].x === bonus.x && snakeSegments[0].y === bonus.y) {
            score += 100;
            bonus = null; // Verwijder bonus
        }

        // Controleer op botsingen met rand
        if (snakeSegments[0].x < 0 || snakeSegments[0].x >= canvas.width || snakeSegments[0].y < 0 || snakeSegments[0].y >= canvas.height) {
            gameOver();
            return;
        }

        // Controleer op botsingen met zichzelf
        for (let i = 1; i < snakeSegments.length; i++) {
            if (snakeSegments[0].x === snakeSegments[i].x && snakeSegments[0].y === snakeSegments[i].y) {
                gameOver();
                return;
            }
        }

        // Tekst voor score
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
            // Teken het hoofd met een oog
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
            drawEye(segment.x, segment.y);
        } else {
            // Teken de rest van het lichaam
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
        }
    });
}

function drawEye(x, y) {
    ctx.fillStyle = 'red';
    const eyeRadius = 3; // Straal van het oog
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

    // Voeg nieuw hoofd toe
    snakeSegments.unshift(head);

    // Verwijder staart
    snakeSegments.pop();
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / segmentSize)) * segmentSize;
    food.y = Math.floor(Math.random() * (canvas.height / segmentSize)) * segmentSize;
}

function generateBonus() {
    bonus = {
        x: Math.floor(Math.random() * (canvas.width / segmentSize)) * segmentSize,
        y: Math.floor(Math.random() * (canvas.height / segmentSize)) * segmentSize
    };
}

function gameOver() {
    highScore = score;
    addHighScoreToStorage(playerName, highScore);
    window.location.href = 'highscores.html';
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    // Verander richting van de slang
    if ((key === 'ArrowUp' || key === 'w') && direction !== 'down') direction = 'up';
    if ((key === 'ArrowDown' || key === 's') && direction !== 'up') direction = 'down';
    if ((key === 'ArrowLeft' || key === 'a') && direction !== 'right') direction = 'left';
    if ((key === 'ArrowRight' || key === 'd') && direction !== 'left') direction = 'right';
});

requestAnimationFrame(update);
