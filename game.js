// 🎵 Preload sounds
let startSound = new Audio("start.mp3.mp3");
let endSound = new Audio("end.mp3.mp3");
let buttonSound = new Audio("color.mp3.mp3"); // if that's your button sound

function playStartSound() { startSound.currentTime = 0; startSound.play(); }
function playEndSound() { endSound.currentTime = 0; endSound.play(); }
function playButtonSound() { buttonSound.currentTime = 0; buttonSound.play(); }

let gameSeq = [];
let userSeq = [];
let started = false;
let level = 0;
let flashSpeed = 600; // default
let highScore = localStorage.getItem("simonHighScore") || 0;
let lastScores = JSON.parse(localStorage.getItem("simonScores")) || [];

// Selectors
let h2 = document.querySelector("#game-instruction");
let levelTitle = document.querySelector("#level-title");
let scoreDisplay = document.querySelector("#score");
let highScoreDisplay = document.querySelector("#high-score");
let scoreboardList = document.querySelector("#scoreboard");
let allBtns = document.querySelectorAll(".btn");

// Update scoreboard
function updateScoreboard() {
  highScoreDisplay.textContent = `High Score: ${highScore}`;
  scoreboardList.innerHTML = "";
  lastScores.forEach(score => {
    let li = document.createElement("li");
    li.textContent = score;
    scoreboardList.appendChild(li);
  });
}

// Start Game
function startGame() {
  if (!started) {
    started = true;
    level = 0;
    gameSeq = [];
    userSeq = [];
    h2.textContent = "Game Started!";
    playStartSound();
    levelUp();
  }
}

// Keyboard + Mobile start
document.addEventListener("keypress", startGame);
document.querySelector("#start-btn").addEventListener("click", startGame);

// Difficulty Modes
let modeBtns = document.querySelectorAll(".mode-btn");
modeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    flashSpeed = Number(btn.dataset.speed);
    h2.textContent = `Mode: ${btn.textContent}`;
  });
});

// Theme Switcher
let themeBtn = document.querySelector("#theme-btn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeBtn.textContent = 
    document.body.classList.contains("dark-mode") 
      ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Flash functions
function gameFlash(btn) {
  btn.classList.add("flash");
  playButtonSound();
  setTimeout(() => btn.classList.remove("flash"), flashSpeed);
}
function userFlash(btn) {
  btn.classList.add("userFlash");
  playButtonSound();
  setTimeout(() => btn.classList.remove("userFlash"), 200);
}

// Level Up
function levelUp() {
  userSeq = [];
  level++;
  levelTitle.textContent = `Level: ${level}`;
  scoreDisplay.textContent = `Score: ${level - 1}`;

  // ⭐ Achievement messages
  if (level === 5) h2.textContent = "⭐ Nice! Level 5 reached!";
  if (level === 10) h2.textContent = "🚀 Master! Level 10!";
  if (level === 20) h2.textContent = "👑 Legend! Level 20!";

  let randIdx = Math.floor(Math.random() * allBtns.length);
  let randBtn = allBtns[randIdx];
  gameSeq.push(randBtn.id);

  setTimeout(() => gameFlash(randBtn), 500);
}

// Check Answer
function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    playEndSound();
    h2.innerHTML = `❌ Game Over! Your score was <b>${level - 1}</b><br>Press Start to try again.`;
    document.body.style.backgroundColor = "red";
    setTimeout(() => document.body.style.backgroundColor = "", 300);
    updateScores();
    reset();
  }
}

// Button Press
function btnPress() {
  if (!started) return;
  let btn = this;
  userFlash(btn);
  userSeq.push(btn.id);
  checkAns(userSeq.length - 1);
}
allBtns.forEach(btn => btn.addEventListener("click", btnPress));

// Update Scores
function updateScores() {
  if (level - 1 > highScore) {
    highScore = level - 1;
    localStorage.setItem("simonHighScore", highScore);
  }
  lastScores.unshift(level - 1);
  if (lastScores.length > 5) lastScores.pop();
  localStorage.setItem("simonScores", JSON.stringify(lastScores));
  updateScoreboard();
}

// Reset
function reset() {
  started = false;
  userSeq = [];
  gameSeq = [];
  level = 0;
}

// Init scoreboard
updateScoreboard();
