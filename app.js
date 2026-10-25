'use strict';

const TOTAL_QUESTIONS = 15;
const POINTS_CORRECT = 1;
const POINTS_WRONG = -2;
const BEST_KEY = 'mathQuiz.best';

const $ = (id) => document.getElementById(id);

const state = {
  questions: [],
  index: 0,
  score: 0,
  correct: 0,
  answers: [],
  startTime: 0,
  timerId: null,
  locked: false,
};

// Random integer in [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Builds 3-digit addition/subtraction questions. The answer is computed directly
// (no eval), and subtraction keeps the larger number first so answers are never negative.
function generateQuestions(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    let a = randInt(100, 999);
    let b = randInt(100, 999);
    const op = Math.random() < 0.5 ? '+' : '-';
    if (op === '-' && b > a) [a, b] = [b, a];
    list.push({ text: `${a} ${op === '-' ? '−' : '+'} ${b}`, answer: op === '+' ? a + b : a - b });
  }
  return list;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function elapsedSeconds() {
  return Math.floor((Date.now() - state.startTime) / 1000);
}

function readBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY));
  } catch {
    return null;
  }
}

function saveBest(result) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(result));
  } catch {
    /* storage unavailable (private mode etc.) — best score just isn't kept */
  }
}

function isBetter(a, b) {
  if (!b) return true;
  return a.score > b.score || (a.score === b.score && a.seconds < b.seconds);
}

function showBest(el) {
  const best = readBest();
  el.textContent = best ? `Best: ${best.score} points in ${formatTime(best.seconds)}` : '';
}

function showScreen(id) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id;
}

function startQuiz() {
  state.questions = generateQuestions(TOTAL_QUESTIONS);
  state.index = 0;
  state.score = 0;
  state.correct = 0;
  state.answers = [];
  state.locked = false;
  state.startTime = Date.now();

  clearInterval(state.timerId);
  $('timer').textContent = '0:00';
  state.timerId = setInterval(() => {
    $('timer').textContent = formatTime(elapsedSeconds());
  }, 250);

  showScreen('quizScreen');
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  $('question').textContent = `${q.text} = ?`;
  $('qCounter').textContent = `${state.index + 1} / ${TOTAL_QUESTIONS}`;
  $('liveScore').textContent = state.score;
  $('progressBar').style.width = `${(state.index / TOTAL_QUESTIONS) * 100}%`;
  $('progress').setAttribute('aria-valuenow', String(state.index));

  const input = $('answerInput');
  input.value = '';
  input.classList.remove('shake');
  input.focus();
}

function submitAnswer(event) {
  event.preventDefault();
  if (state.locked) return;

  const input = $('answerInput');
  const raw = input.value.trim();
  if (!/^-?\d+$/.test(raw)) {
    // Empty or non-numeric input is not counted as an answer
    $('feedback').textContent = 'Enter a whole number.';
    $('feedback').className = 'feedback warn';
    input.classList.remove('shake');
    void input.offsetWidth; // restart the animation
    input.classList.add('shake');
    return;
  }

  const q = state.questions[state.index];
  const given = Number(raw);
  const ok = given === q.answer;

  state.score += ok ? POINTS_CORRECT : POINTS_WRONG;
  if (ok) state.correct++;
  state.answers.push({ text: q.text, answer: q.answer, given, ok });

  $('liveScore').textContent = state.score;
  $('feedback').textContent = ok ? 'Correct! +1' : `Not quite — ${q.text} = ${q.answer}  (−2)`;
  $('feedback').className = `feedback ${ok ? 'good' : 'bad'}`;

  state.locked = true;
  setTimeout(() => {
    state.locked = false;
    state.index++;
    if (state.index < TOTAL_QUESTIONS) {
      renderQuestion();
    } else {
      endQuiz();
    }
  }, ok ? 450 : 1100);
}

function endQuiz() {
  clearInterval(state.timerId);
  const seconds = elapsedSeconds();
  $('progressBar').style.width = '100%';

  const result = { score: state.score, seconds };
  const prevBest = readBest();
  const newBest = isBetter(result, prevBest);
  if (newBest) saveBest(result);

  $('finalScore').textContent = state.score;
  $('finalCorrect').textContent = `${state.correct}/${TOTAL_QUESTIONS}`;
  $('finalTime').textContent = formatTime(seconds);

  const pct = state.correct / TOTAL_QUESTIONS;
  $('resultTitle').textContent =
    pct === 1 ? 'Perfect score!' : pct >= 0.8 ? 'Great job!' : pct >= 0.5 ? 'Good effort!' : 'Keep practising!';

  $('bestEnd').textContent = newBest ? 'New personal best!' : '';
  if (!newBest) showBest($('bestEnd'));

  const list = $('reviewList');
  list.replaceChildren(
    ...state.answers.map((a) => {
      const li = document.createElement('li');
      li.className = a.ok ? 'ok' : 'wrong';
      li.textContent = a.ok ? `${a.text} = ${a.answer} ✓` : `${a.text} = ${a.answer} (you said ${a.given})`;
      return li;
    })
  );

  $('feedback').textContent = '';
  showScreen('resultScreen');
  $('restartBtn').focus();
}

$('startBtn').addEventListener('click', startQuiz);
$('restartBtn').addEventListener('click', startQuiz);
$('answerForm').addEventListener('submit', submitAnswer);
showBest($('bestStart'));
