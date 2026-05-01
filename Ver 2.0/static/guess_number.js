let secretNumber;
let attempts;
let gameFinished;

const guessInput = document.getElementById("guessInput");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");

function startGuessGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    gameFinished = false;

    attemptsText.textContent = attempts;
    message.textContent = "";
    guessInput.value = "";
    guessInput.focus();
}

function checkGuess() {
    if (gameFinished) {
        return;
    }

    const guess = Number(guessInput.value);

    if (!guess || guess < 1 || guess > 100) {
        message.textContent = "Please enter a number between 1 and 100.";
        return;
    }

    attempts++;
    attemptsText.textContent = attempts;

    if (guess === secretNumber) {
        message.textContent = "Correct! You won!";
        gameFinished = true;
    } else if (guess < secretNumber) {
        message.textContent = "Too low. Try again.";
    } else {
        message.textContent = "Too high. Try again.";
    }

    guessInput.value = "";
    guessInput.focus();
}

function restartGuessGame() {
    startGuessGame();
}

guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

startGuessGame();
