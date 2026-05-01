const canvas = document.getElementById("obbyCanvas");
const ctx = canvas.getContext("2d");
const starsText = document.getElementById("stars");
const livesText = document.getElementById("lives");
const messageText = document.getElementById("message");
const isScarlett = canvas.dataset.scarlett === "1";

const keys = {
    left: false,
    right: false,
    jump: false
};

let player;
let cameraX;
let lives;
let stars;
let gameWon;
let gameOver;
let platforms;
let collectibles;
let finishFlag;
let animationFrameId;

const gravity = 0.65;
const friction = 0.82;
const moveSpeed = 0.85;
const maxSpeed = 6.2;
const jumpPower = -14.5;
const worldWidth = 2200;
const groundY = 455;

function showMessage(text) {
    messageText.textContent = text;
}

function startObby() {
    player = {
        x: 55,
        y: 380,
        width: 34,
        height: 46,
        vx: 0,
        vy: 0,
        onGround: false,
        color: isScarlett ? "#f9a8d4" : "#22c55e"
    };

    cameraX = 0;
    lives = 3;
    stars = 0;
    gameWon = false;
    gameOver = false;

    platforms = [
        { x: 0, y: groundY, width: 340, height: 38 },
        { x: 410, y: 390, width: 190, height: 26 },
        { x: 680, y: 330, width: 180, height: 26 },
        { x: 960, y: 390, width: 210, height: 26 },
        { x: 1270, y: 320, width: 190, height: 26 },
        { x: 1550, y: 380, width: 220, height: 26 },
        { x: 1850, y: 335, width: 260, height: 26 }
    ];

    collectibles = [
        { x: 470, y: 350, collected: false },
        { x: 745, y: 290, collected: false },
        { x: 1040, y: 350, collected: false },
        { x: 1345, y: 280, collected: false },
        { x: 1635, y: 340, collected: false }
    ];

    finishFlag = { x: 2030, y: 245, width: 42, height: 90 };

    starsText.textContent = stars;
    livesText.textContent = lives;

    showMessage(isScarlett ? "Ready Scarlett? Jump to the finish flag!" : "Jump across the platforms and reach the finish flag.");

    cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function restartObby() {
    startObby();
}

function gameLoop() {
    updateGame();
    drawGame();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function updateGame() {
    if (gameWon || gameOver) {
        return;
    }

    if (keys.left) {
        player.vx -= moveSpeed;
    }

    if (keys.right) {
        player.vx += moveSpeed;
    }

    if (keys.jump && player.onGround) {
        player.vy = jumpPower;
        player.onGround = false;
    }

    player.vx *= friction;
    player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
    player.vy += gravity;

    player.x += player.vx;
    player.y += player.vy;

    player.x = Math.max(0, Math.min(worldWidth - player.width, player.x));

    player.onGround = false;

    for (const platform of platforms) {
        const isFalling = player.vy >= 0;
        const wasAbove = player.y + player.height - player.vy <= platform.y;
        const overlapsX = player.x < platform.x + platform.width && player.x + player.width > platform.x;
        const overlapsY = player.y + player.height >= platform.y && player.y < platform.y + platform.height;

        if (isFalling && wasAbove && overlapsX && overlapsY) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    }

    if (player.y > canvas.height + 80) {
        loseLife();
    }

    collectStars();
    checkFinish();

    cameraX = player.x - canvas.width * 0.35;
    cameraX = Math.max(0, Math.min(worldWidth - canvas.width, cameraX));
}

function loseLife() {
    lives--;
    livesText.textContent = lives;

    if (lives <= 0) {
        gameOver = true;
        showMessage(isScarlett ? "Game over Scarlett. Try again, you can do it!" : "Game over. Try again!");
        return;
    }

    player.x = 55;
    player.y = 380;
    player.vx = 0;
    player.vy = 0;
    cameraX = 0;
    showMessage(isScarlett ? "Keep going Scarlett!" : "Keep going!");
}

function collectStars() {
    for (const star of collectibles) {
        if (star.collected) {
            continue;
        }

        const dx = player.x + player.width / 2 - star.x;
        const dy = player.y + player.height / 2 - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 34) {
            star.collected = true;
            stars++;
            starsText.textContent = stars;

            if (isScarlett) {
                if (stars === 1) showMessage("Good job Scarlett! You collected your first star!");
                else if (stars === 3) showMessage("Well done Scarlett! Three stars already!");
                else if (stars === 5) showMessage("Amazing Scarlett! You collected all five stars!");
                else showMessage("Nice star Scarlett!");
            } else {
                showMessage("Star collected!");
            }
        }
    }
}

function checkFinish() {
    const touchesFlag =
        player.x < finishFlag.x + finishFlag.width &&
        player.x + player.width > finishFlag.x &&
        player.y < finishFlag.y + finishFlag.height &&
        player.y + player.height > finishFlag.y;

    if (touchesFlag) {
        gameWon = true;
        showMessage(isScarlett ? `You won Scarlett! Final stars: ${stars}. Fantastic jumping!` : `You won! Final stars: ${stars}.`);
    }
}

function drawGame() {
    drawBackground();

    ctx.save();
    ctx.translate(-cameraX, 0);

    drawPlatforms();
    drawCollectibles();
    drawFinishFlag();
    drawPlayer();

    ctx.restore();

    if (gameWon || gameOver) {
        drawOverlay();
    }
}

function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);

    if (isScarlett) {
        sky.addColorStop(0, "#4c1d95");
        sky.addColorStop(0.52, "#831843");
        sky.addColorStop(1, "#064e3b");
    } else {
        sky.addColorStop(0, "#0f172a");
        sky.addColorStop(0.55, "#1e293b");
        sky.addColorStop(1, "#052e16");
    }

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Soft hills
    ctx.fillStyle = isScarlett ? "rgba(134, 239, 172, 0.18)" : "rgba(34, 197, 94, 0.16)";
    for (let i = -1; i < 6; i++) {
        const x = i * 220 - (cameraX * 0.25 % 220);
        ctx.beginPath();
        ctx.arc(x, 500, 160, Math.PI, 0);
        ctx.fill();
    }

    // Floating decorations
    ctx.font = "24px Arial";
    const decorations = isScarlett ? ["🌸", "✨", "🦋", "🌷"] : ["🌿", "✨", "🍄", "🌱"];
    for (let i = 0; i < 12; i++) {
        const x = (i * 190 - cameraX * 0.35) % (canvas.width + 190);
        const y = 70 + (i % 4) * 42;
        ctx.fillText(decorations[i % decorations.length], x, y);
    }
}

function drawPlatforms() {
    for (const platform of platforms) {
        ctx.fillStyle = isScarlett ? "#a855f7" : "#166534";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        ctx.fillStyle = isScarlett ? "#f9a8d4" : "#86efac";
        ctx.fillRect(platform.x, platform.y, platform.width, 8);
    }
}

function drawCollectibles() {
    ctx.font = "30px Arial";
    for (const star of collectibles) {
        if (!star.collected) {
            ctx.fillText(isScarlett ? "🌟" : "⭐", star.x - 16, star.y + 12);
        }
    }
}

function drawFinishFlag() {
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(finishFlag.x, finishFlag.y, 8, finishFlag.height);

    ctx.fillStyle = isScarlett ? "#ec4899" : "#22c55e";
    ctx.beginPath();
    ctx.moveTo(finishFlag.x + 8, finishFlag.y);
    ctx.lineTo(finishFlag.x + 70, finishFlag.y + 22);
    ctx.lineTo(finishFlag.x + 8, finishFlag.y + 44);
    ctx.closePath();
    ctx.fill();
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "white";
    ctx.fillRect(player.x + 8, player.y + 10, 6, 6);
    ctx.fillRect(player.x + 21, player.y + 10, 6, 6);

    ctx.fillStyle = isScarlett ? "#be185d" : "#14532d";
    ctx.fillRect(player.x + 10, player.y + 30, 16, 4);
}

function drawOverlay() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 34px Arial";
    ctx.fillText(gameWon ? (isScarlett ? "You Won Scarlett!" : "You Won!") : "Game Over", canvas.width / 2, canvas.height / 2 - 24);

    ctx.font = "18px Arial";
    ctx.fillText("Press Restart to play again", canvas.width / 2, canvas.height / 2 + 18);
    ctx.textAlign = "left";
}

function setButtonControl(buttonId, keyName) {
    const button = document.getElementById(buttonId);

    button.addEventListener("touchstart", function(event) {
        event.preventDefault();
        keys[keyName] = true;
    }, { passive: false });

    button.addEventListener("touchend", function(event) {
        event.preventDefault();
        keys[keyName] = false;
    }, { passive: false });

    button.addEventListener("mousedown", function() {
        keys[keyName] = true;
    });

    button.addEventListener("mouseup", function() {
        keys[keyName] = false;
    });

    button.addEventListener("mouseleave", function() {
        keys[keyName] = false;
    });
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keys.left = true;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keys.right = true;
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        event.preventDefault();
        keys.jump = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keys.left = false;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keys.right = false;
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        keys.jump = false;
    }
});

setButtonControl("leftBtn", "left");
setButtonControl("rightBtn", "right");
setButtonControl("jumpBtn", "jump");

canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();
}, { passive: false });

startObby();
