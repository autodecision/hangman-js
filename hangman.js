import words from "./words.js";
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let wordField = document.querySelector('#word');
let inputField = document.querySelector('#input');
let guessBtn = document.querySelector('#guess');
let restartBtn = document.querySelector('#restart');
let hidden = document.querySelector('.hidden');
let usedLetters = document.querySelector('#used');
let letterStorage = [];
let wordStorage = [];
let word;
let lives = 6;
let gameState = 1;

// This makes sure the input field gets focused, and that the enter key is responsive to the game
inputField.focus();
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (gameState === 1) {
            guessBtn.click();
        } else if (gameState === 0) {
            restartBtn.click();
        }
    }
});

function generateWord() {
    // Pick a word at random from the word list, until a word with more than 4 letters is chosen
    do {
        word = words[Math.floor(Math.random() * words.length)];
    } while (word.length < 5);

    // Generate the spaces on the page for the word
    for (let i = 0; i < word.length -1; i++) {
        wordStorage.push('_ ');
    }
    wordStorage.push('_ ');
    wordField.textContent = wordStorage.join('');
}

// Draw the stand and noose
ctx.strokeStyle = 'white';
ctx.beginPath();
ctx.moveTo(75, 200);
ctx.lineTo(75, 50);
ctx.lineTo(175, 50);
ctx.lineTo(175, 80);
ctx.stroke();

// Draw the body as lives are lost
function drawHang() {
    ctx.strokeStyle = 'white';
    switch(lives) {
        case 5:
            // Draw the head
            ctx.beginPath();
            ctx.arc(175, 100, 20, 0, Math.PI * 2, true);
            ctx.stroke();
            break;
        case 4:
            // Draw the body
            ctx.beginPath();
            ctx.moveTo(175, 120);
            ctx.lineTo(175, 170);
            ctx.stroke();
            break;
        case 3:
            // Draw the left arm
            ctx.beginPath();
            ctx.moveTo(175, 130);
            ctx.lineTo(145, 150);
            ctx.stroke();
            break;
        case 2:
            // Draw the right arm
            ctx.beginPath();
            ctx.moveTo(175, 130);
            ctx.lineTo(205, 150);
            ctx.stroke();
            break;
        case 1:
            // Draw the left leg
            ctx.beginPath();
            ctx.moveTo(175, 170);
            ctx.lineTo(145, 200);
            ctx.stroke();
            break;
        case 0:
            // Draw the right leg
            ctx.beginPath();
            ctx.moveTo(175, 170);
            ctx.lineTo(205, 200);
            ctx.stroke();
            break;
    }
}

generateWord();

// setTimeout is used throughout the code to push alerts to the end of the stack and allow visual changes first

guessBtn.addEventListener("click", () => {
    if (gameState) {
        // Verify user enters one letter
        if (inputField.value.length > 1 || inputField.value.length === 0) {
            alert('Use one letter!');
        } else if (/[^a-zA-Z]/.test(inputField.value)) {
            alert('Invalid character!');
        } else {
            // Show the player what letters they have tried
            if (!letterStorage.includes(`${inputField.value.toLowerCase()} `)) {
                letterStorage.push(`${inputField.value.toLowerCase()} `)
                usedLetters.textContent = letterStorage.join(' ');
            }
            if (word.includes(inputField.value.toLowerCase())) {
                // Handle correct guesses: Replace the corresponding blank in storage, display the storage
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === inputField.value.toLowerCase()) {
                        wordStorage[i] =`${word[i]} `;
                        wordField.textContent = wordStorage.join('');
                    }
                }
            } else {
                // Handle incorrect guesses
                lives--;
                drawHang();
                if (lives === 0) {
                    setTimeout(() => {
                        alert('The game is lost!');
                        gameState = 0;
                        hidden.style.display = 'block';
                        wordField.textContent = word.split('').join(' ');
                        wordField.style.color = 'red';
                    }, 0);
                } else {
                    setTimeout(() => {
                        alert(`Wrong letter! You have ${lives} lives left.`);
                    }, 0);
                }
            }
        }
        // Recognize if the game is won
        inputField.value = '';
        setTimeout(() => {
            if (!wordStorage.includes('_ ')) {
                alert('You win!');
                gameState = 0;
                hidden.style.display = 'block';
                wordField.style.color = 'green';
            }
        }, 0);
    }
    inputField.focus();
});

restartBtn.addEventListener("click", () => {
    // Initialize the game
    gameState = 1;
    hidden.style.display = 'none';
    word = '';
    wordField.value = '';
    wordStorage = [];
    letterStorage = [];
    usedLetters.textContent = '';
    lives = 6;
    wordField.style.color = 'white';
    generateWord();
    // Reset the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(75, 200);
    ctx.lineTo(75, 50);
    ctx.lineTo(175, 50);
    ctx.lineTo(175, 80);
    ctx.stroke();
    inputField.focus();
});