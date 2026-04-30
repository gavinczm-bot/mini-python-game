const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const boxSize = 20;
const canvasSize = 400;
const totalBoxes = canvasSize / boxSize;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameInterval;
let gameOver;

function startGame() {
    snake = [
        { x: 10, y: 10 }
    ];

    food = createFood();

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;
    gameOver = false;

    scoreText.textContent = score;

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 120);
}

function restartGame() {
    startGame();
}

function createFood() {
    let newFood;

    while (true) {
        newFood = {
            x: Math.floor(Math.random() * totalBoxes),
            y: Math.floor(Math.random() * totalBoxes)
        };

        const foodOnSnake = snake.some(part => {
            return part.x === newFood.x && part.y === newFood.y;
        });

        if (!foodOnSnake) {
            return newFood;
        }
    }
}

function gameLoop() {
    if (gameOver) {
        return;
    }

    direction = nextDirection;

    const head = { ...snake[0] };

    if (direction === "UP") {
        head.y--;
    } else if (direction === "DOWN") {
        head.y++;
    } else if (direction === "LEFT") {
        head.x--;
    } else if (direction === "RIGHT") {
        head.x++;
    }

    if (hitWall(head) || hitSelf(head)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.textContent = score;
        food = createFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function hitWall(head) {
    return (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= totalBoxes ||
        head.y >= totalBoxes
    );
}

function hitSelf(head) {
    return snake.some(part => {
        return part.x === head.x && part.y === head.y;
    });
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);

    drawGame();

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 25);
    ctx.fillText("Click Restart to play again", canvas.width / 2, canvas.height / 2 + 55);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawFood();
    drawSnake();
}

function drawGrid() {
    ctx.strokeStyle = "#1e293b";

    for (let x = 0; x < canvas.width; x += boxSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += boxSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.fillStyle = "#22c55e";
        } else {
            ctx.fillStyle = "#16a34a";
        }

        ctx.fillRect(
            part.x * boxSize,
            part.y * boxSize,
            boxSize - 1,
            boxSize - 1
        );
    });
}

function drawFood() {
    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
        food.x * boxSize,
        food.y * boxSize,
        boxSize - 1,
        boxSize - 1
    );
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        nextDirection = "UP";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        nextDirection = "DOWN";
    } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        nextDirection = "LEFT";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        nextDirection = "RIGHT";
    }
});

startGame();