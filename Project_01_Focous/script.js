const setup = document.getElementById("setup");
const dashboard = document.getElementById("dashboard");

const sessionName = document.getElementById("sessionName");
const studyMin = document.getElementById("studyMin");
const breakMin = document.getElementById("breakMin");
const cycleCount = document.getElementById("cycleCount");

const errName = document.getElementById("errName");
const errStudy = document.getElementById("errStudy");
const errBreak = document.getElementById("errBreak");
const errCycle = document.getElementById("errCycle");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const phaseText = document.getElementById("phaseText");
const timeText = document.getElementById("timeText");
const cycleText = document.getElementById("cycleText");
const progressFill = document.getElementById("progressFill");
const historyDiv = document.getElementById("history");

/* 
---------------- STATE ---------------- 
*/

let state = JSON.parse(localStorage.getItem("currentSession")) || {
  phase: "study",
  currentCycle: 1,
  remainingTime: 0,
  totalTime: 0,
  paused: false,
  lastActive: Date.now()
};

let timer = null;
let autoSaveTimer = null;

/* ---------------- FORM VALIDATION (DEBOUNCED) ---------------- */
let validateTimer;
[sessionName, studyMin, breakMin, cycleCount].forEach(input => {
  input.addEventListener("input", () => {
    clearTimeout(validateTimer);
    validateTimer = setTimeout(validateForm, 300);
  });
});

function validateForm() {
  let valid = true;

  if (sessionName.value.trim().length < 3) {
    errName.textContent = "Minimum 3 characters required";
    valid = false;
  } else errName.textContent = "";

  if (studyMin.value < 1) {
    errStudy.textContent = "Minimum 1 minute required";
    valid = false;
  } else errStudy.textContent = "";

  if (breakMin.value < 1) {
    errBreak.textContent = "Minimum 1 minute required";
    valid = false;
  } else errBreak.textContent = "";

  if (cycleCount.value < 1 || cycleCount.value > 4) {
    errCycle.textContent = "Cycles must be 1 to 4";
    valid = false;
  } else errCycle.textContent = "";

  startBtn.disabled = !valid;
}

/* ---------------- START SESSION ---------------- */
startBtn.addEventListener("click", () => {
  setup.style.display = "none";
  dashboard.style.display = "block";
  startStudy();
  startAutoSave();
});

/* ---------------- STUDY & BREAK ---------------- */
function startStudy() {
  state.phase = "study";
  state.remainingTime = studyMin.value * 60;
  state.totalTime = state.remainingTime;

  phaseText.textContent = "Study 📚";
  cycleText.textContent = `Cycle ${state.currentCycle} of ${cycleCount.value}`;

  startTimer();
}

function startBreak() {
  state.phase = "break";
  state.remainingTime = breakMin.value * 60;
  state.totalTime = state.remainingTime;

  phaseText.textContent = "Break ☕";
  fetchMotivation(); // async quote
  startTimer();
}

/* ---------------- TIMER ---------------- */
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!state.paused) {
      state.remainingTime--;
      updateUI();

      if (state.remainingTime <= 0) {
        clearInterval(timer);
        state.phase === "study" ? startBreak() : nextCycle();
      }
    }
  }, 1000);
}

function updateUI() {
  const min = String(Math.floor(state.remainingTime / 60)).padStart(2, "0");
  const sec = String(state.remainingTime % 60).padStart(2, "0");
  timeText.textContent = `${min}:${sec}`;

  progressFill.style.width =
    ((state.totalTime - state.remainingTime) / state.totalTime) * 100 + "%";
}

function nextCycle() {
  state.currentCycle++;
  if (state.currentCycle > cycleCount.value) {
    endSession();
  } else {
    startStudy();
  }
}

/* ---------------- MOTIVATIONAL QUOTE ---------------- */
async function fetchMotivation() {
  cycleText.textContent = "Loading motivation...";
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    cycleText.textContent = data.content;
  } catch {
    cycleText.textContent = "Relax. Recharge. You're doing great 💪";
  }
}

/* ---------------- AUTO SAVE ---------------- */
function startAutoSave() {
  autoSaveTimer = setInterval(() => {
    localStorage.setItem("currentSession", JSON.stringify(state));
  }, 10000);
}

/* ---------------- INACTIVITY HANDLING ---------------- */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) autoPause();
});

["mousemove","keydown","click"].forEach(e => {
  document.addEventListener(e, () => state.lastActive = Date.now());
});

setInterval(() => {
  if (Date.now() - state.lastActive > 60000) autoPause();
}, 5000);

function autoPause() {
  state.paused = true;
  pauseBtn.textContent = "Resume";
}

/* ---------------- PAUSE BUTTON ---------------- */
pauseBtn.addEventListener("click", () => {
  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? "Resume" : "Pause";
});

/* ---------------- END SESSION ---------------- */
function endSession() {
  clearInterval(timer);
  clearInterval(autoSaveTimer);

  const history = JSON.parse(localStorage.getItem("sessionHistory")) || [];
  history.push({
    name: sessionName.value,
    totalStudy: studyMin.value * cycleCount.value,
    completed: true,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("sessionHistory", JSON.stringify(history));
  localStorage.removeItem("currentSession");

  phaseText.textContent = "Session Completed 🎉";
  pauseBtn.style.display = "none";
  renderHistory();
}

/* ---------------- HISTORY ---------------- */
function renderHistory() {
  historyDiv.innerHTML = "<h3>Session History</h3>";
  const history = JSON.parse(localStorage.getItem("sessionHistory")) || [];

  history.forEach(s => {
    const div = document.createElement("div");
    div.textContent = `${s.name} – ${s.totalStudy} min`;
    historyDiv.appendChild(div);
  });
}

renderHistory();


