const wolvesPath = 'img/wolfs/';
const othersPath = 'img/others/';
const wolfImages = [
    'wolf1.png', 'wolf2.png', 'wolf3.png', 'wolf4.png', 'wolf5.png', 'wolf6.png',
    'wolf7.png', 'wolf8.png', 'wolf9.png', 'wolf10.png', 'wolf11.png', 'wolf12.png', 'wolf13.png'
];
const otherImages = [
    'others1.png', 'others2.png', 'others3.png', 'others4.png', 'others5.png', 'others6.png'
];

let score = 0;
let strikes = 0;
const maxStrikes = 3;
let countdown = 5;
let timerInterval;
let isPaused = true; // Game starts in a paused state
let spacePressed = false;

const imageElement = document.getElementById('image');
const scoreElement = document.getElementById('score');
const strikesElement = document.getElementById('strikes');
const timerElement = document.getElementById('timer');
const errorElement = document.getElementById('error-message');
const errorSound = new Audio('error.mp3');
const resetButton = document.getElementById('reset');

// Function to get a random image
function getRandomImage() {
    const isWolf = Math.random() < 0.5; // 50% chance of being a wolf
    const imagePath = isWolf
        ? wolvesPath + wolfImages[Math.floor(Math.random() * wolfImages.length)]
        : othersPath + otherImages[Math.floor(Math.random() * otherImages.length)];

    return { src: imagePath, isWolf };
}

// Function to show an error message
function showErrorMessage(message) {
    errorElement.textContent = message;
    errorElement.style.opacity = 1;
    setTimeout(() => {
        errorElement.style.opacity = 0; // Fade out the error
    }, 2000);
}

// Function to end the game
function endGame() {
    clearInterval(timerInterval);
    isPaused = true;
    showErrorMessage(`המשחק נגמר והניקוד שלך הוא ${score}`);
    startButton.disabled = false; // Re-enable Start Game button
}

// Function to update the game
function updateGame() {
    const randomImage = getRandomImage();
    imageElement.src = randomImage.src;
    imageElement.dataset.isWolf = randomImage.isWolf; // Store whether it's a wolf

    // Reset the countdown timer
    countdown = 5;
    timerElement.textContent = `${countdown}`;

    // Clear any existing interval and start a new one
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isPaused) return; // Pause logic
        countdown--;
        timerElement.textContent = `${countdown}`;

        if (countdown === 0) {
            clearInterval(timerInterval);

            const isWolf = imageElement.dataset.isWolf === 'true';
            if (isWolf) {
                strikes++; // Penalize for not pressing Space when it's a wolf
                strikesElement.textContent = `טעויות: ${strikes}/${maxStrikes}`;
                errorSound.play();
                showErrorMessage('פספסת את הזאב!');
                if (strikes >= maxStrikes) {
                    endGame();
                    return;
                }
            }
            updateGame(); // Move to the next image
        }
    }, 1000);
}

// Function to handle key press
function handleKeyPress(event) {
    if (event.code === 'Space' && !spacePressed && !isPaused) {
        // Trigger action on initial Spacebar press
        spacePressed = true;
        clearInterval(timerInterval); // Stop the timer
        const isWolf = imageElement.dataset.isWolf === 'true';
        if (isWolf) {
            score++;
            scoreElement.textContent = `ניקוד: ${score}`;
        } else {
            strikes++;
            strikesElement.textContent = `טעויות: ${strikes}/${maxStrikes}`;
            errorSound.play();
            showErrorMessage('Incorrect! This was not a wolf!');
            if (strikes >= maxStrikes) {
                endGame();
                return;
            }
        }
    }
}

// Function to handle key release
function handleKeyRelease(event) {
    if (event.code === 'Space' && spacePressed && !isPaused) {
        spacePressed = false; // Allow the next image only after Space is released
        updateGame(); // Move to the next image
    }
}

// Function to reset the game
function resetGame() {
    score = 0;
    strikes = 0;
    countdown = 5;
    scoreElement.textContent = 'ניקוד: 0';
    strikesElement.textContent = `טעויות: 0/${maxStrikes}`;
    timerElement.textContent = `${countdown}`;
    clearInterval(timerInterval);
    isPaused = true;
    spacePressed = false;
}

// Initialize the game and button event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', handleKeyPress); // Listen for key presses
    document.addEventListener('keyup', handleKeyRelease); // Listen for key releases
    resetButton.addEventListener('click', resetGame);
});
