 //  QUESTIONS

const questions = [
  {
    question: "Who is the current Prime Minister of India?",
    options: ["Steve Jobs", "Bill Gates", "Narendra Modi", "Elon Musk"],
    correct: "Narendra Modi"
  },
  {
    question: "Which is the national bird of India?",
    options: ["Peacock", "Parrot", "Eagle", "Pigeon"],
    correct: "Peacock"
  },
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    correct: "Delhi"
  },
  {
    question: "Largest planet in our solar system?",
    options: ["Mars", "Earth", "Jupiter", "Venus"],
    correct: "Jupiter"
  },
  {
    question: "Who discovered gravity?",
    options: ["Einstein", "Newton", "Tesla", "Galileo"],
    correct: "Newton"
  },
  {
    question: "Who wrote the Indian national anthem 'Jana Gana Mana'?",
     options: [
      "1) Rabindranath Tagore", 
      "2) Mahatma Gandhi", 
      "3) Bankim Chandra Chatterjee",
      "4) Subhash Chandra Bose",
    ],
      correct: "1) Rabindranath Tagore"
    

  },
  {
    question: "In which year did India win its first Cricket World Cup?",
     options: ["1) 1975", "2) 1983", "3) 1996", "4) 2007"],
     correct: "2) 1983"

  }
];

const prizeMoney = [1000, 5000, 10000, 50000, 100000,1500000, 2000000];



//   VARIABLES
 

let currentQuestion = 0;
let lastPrize = 0;
let timeLeft = 30;
let timer;


 
  //  SOUND HELPERS


function playSound(id) {
  const sound = document.getElementById(id);
  sound.currentTime = 0;
  sound.play();
}

function stopSound(id) {
  const sound = document.getElementById(id);
  sound.pause();
  sound.currentTime = 0;
}


/* =============================
   TIMER
============================= */

function startTimer() {
  timeLeft = 30;
  document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

  playSound("timer-audio");

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      stopTimer();
      playSound("wrong-sound");
      endGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  stopSound("timer-audio");
}


/* =============================
   SHUFFLE
============================= */

function shuffleQuestions() {
  questions.sort(() => Math.random() - 0.5);
}


/* =============================
   PRIZE LADDER
============================= */

function updatePrizeLadder() {
  const ul = document.getElementById("prize-ladder");
  ul.innerHTML = "";

  for (let i = prizeMoney.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    li.innerText = `₹ ${prizeMoney[i]}`;

    if (i === currentQuestion) li.classList.add("active");

    ul.appendChild(li);
  }
}


/* =============================
   LOAD QUESTION
============================= */

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    winGame();
    return;
  }

  stopTimer();

  const q = questions[currentQuestion];

  document.getElementById("question").innerText =
    `Q${currentQuestion + 1}: ${q.question}`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(btn, opt);
    optionsDiv.appendChild(btn);
  });

  updatePrizeLadder();
  startTimer();
}


/* =============================
   CHECK ANSWER
============================= */

function checkAnswer(button, selected) {
  stopTimer();

  const buttons = document.querySelectorAll(".options button");
  buttons.forEach(b => b.disabled = true);

  const correct = questions[currentQuestion].correct;

  buttons.forEach(b => {
    if (b.innerText === correct) b.classList.add("correct");
  });

  if (selected === correct) {
    playSound("correct-sound");
    lastPrize = prizeMoney[currentQuestion];
    currentQuestion++;
    setTimeout(loadQuestion, 1500);
  } else {
    button.classList.add("wrong");
    playSound("wrong-sound");
    setTimeout(endGame, 1500);
  }
}


/* =============================
   END GAME
============================= */

function endGame() {
  document.getElementById("question").innerText = "Game Over!";
  document.getElementById("options").innerHTML = "";
  document.getElementById("restart-btn").style.display = "block";
}


/* =============================
   WIN GAME
============================= */

function winGame() {
  document.getElementById("question").innerText =
    `🎉 You won ₹ ${lastPrize}!`;
  document.getElementById("restart-btn").style.display = "block";
}


/* =============================
   START + RESTART
============================= */

document.getElementById("start-button").onclick = () => {
  shuffleQuestions();
  document.getElementById("start-container").style.display = "none";
  loadQuestion();
};

document.getElementById("restart-btn").onclick = () => location.reload();
