const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const scarlettMessage = document.getElementById("scarlettMessage");
const isScarlettMode = document.body.dataset.scarlett === "true";

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
let touchStartX = 0;
let touchStartY = 0;

function setScarlettMessage(text) {
    if (!isScarlettMode || !scarlettMessage) {
        return;
    }

    scarlettMessage.textContent = text;
}

function startGame() {
    snake = [
        { x: 10, y: 10 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    gameOver = false;
    scoreText.textContent = score;

    if (isScarlettMode) {
        setScarlettMessage("Good luck Scarlett! 🌸");
    }

    food = createFood();

    clearInterval(gameInterval);
    drawGame();
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
        showFoodMessage();
    } else {
        snake.pop();
    }

    drawGame();
}

function showFoodMessage() {
    if (!isScarlettMode) {
        return;
    }

    if (score === 1) {
        setScarlettMessage("Good job Scarlett! Your snake found its first food! 🌸");
    } else if (score === 3) {
        setScarlettMessage("Well done Scarlett! Three foods already! ✨");
    } else if (score === 5) {
        setScarlettMessage("Your snake ate five foods Scarlett! Amazing! 🐍💖");
    } else if (score === 10) {
        setScarlettMessage("Wow Scarlett, ten foods! Secret Garden champion! 🏆");
    } else if (score % 5 === 0) {
        setScarlettMessage("Fantastic Scarlett! Score " + score + "! 🌟");
    } else {
        const messages = [
            "Nice one Scarlett! 🌷",
            "Great move Scarlett! 🦋",
            "Keep going Scarlett! ✨",
            "Brilliant Scarlett! 🌸",
            "Your snake is growing Scarlett! 🐍"
        ];
        setScarlettMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
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

    if (isScarlettMode) {
        setScarlettMessage("Game over Scarlett. Final score: " + score + ". You did great! 💖");
    }

    drawGame();

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(isScarlettMode ? "Well Done Scarlett!" : "Game Over", canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 25);
    ctx.fillText("Tap Restart to play again", canvas.width / 2, canvas.height / 2 + 55);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawFood();
    drawSnake();
}

function drawGrid() {
    ctx.strokeStyle = isScarlettMode ? "#4c1d63" : "#1e293b";

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
        if (isScarlettMode) {
            ctx.fillStyle = index === 0 ? "#f472b6" : "#a78bfa";
        } else if (index === 0) {
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

        if (isScarlettMode && index === 0) {
            ctx.fillStyle = "#fff7ed";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText("✨", part.x * boxSize + boxSize / 2, part.y * boxSize + 14);
        }
    });
}

function drawFood() {
    ctx.fillStyle = isScarlettMode ? "#facc15" : "#ef4444";

    ctx.fillRect(
        food.x * boxSize,
        food.y * boxSize,
        boxSize - 1,
        boxSize - 1
    );

    if (isScarlettMode) {
        ctx.fillStyle = "#7c2d12";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🌸", food.x * boxSize + boxSize / 2, food.y * boxSize + 16);
    }
}

function changeDirection(newDirection) {
    if (gameOver) {
        return;
    }

    if (newDirection === "UP" && direction !== "DOWN") {
        nextDirection = "UP";
    } else if (newDirection === "DOWN" && direction !== "UP") {
        nextDirection = "DOWN";
    } else if (newDirection === "LEFT" && direction !== "RIGHT") {
        nextDirection = "LEFT";
    } else if (newDirection === "RIGHT" && direction !== "LEFT") {
        nextDirection = "RIGHT";
    }
}

document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === "ArrowUp") {
        changeDirection("UP");
    } else if (event.key === "ArrowDown") {
        changeDirection("DOWN");
    } else if (event.key === "ArrowLeft") {
        changeDirection("LEFT");
    } else if (event.key === "ArrowRight") {
        changeDirection("RIGHT");
    }
});

document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", function() {
        changeDirection(this.dataset.direction);
    });

    button.addEventListener("touchstart", function(event) {
        event.preventDefault();
        changeDirection(this.dataset.direction);
    }, { passive: false });
});

canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, { passive: false });

canvas.addEventListener("touchend", function(event) {
    event.preventDefault();

    if (!event.changedTouches.length) {
        return;
    }

    const touch = event.changedTouches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;
    const minimumSwipe = 25;

    if (Math.abs(diffX) < minimumSwipe && Math.abs(diffY) < minimumSwipe) {
        return;
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        changeDirection(diffX > 0 ? "RIGHT" : "LEFT");
    } else {
        changeDirection(diffY > 0 ? "DOWN" : "UP");
    }
}, { passive: false });

startGame();
