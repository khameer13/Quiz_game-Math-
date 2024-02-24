const questions = [];

// Generate 15 random addition and subtraction questions
for (let i = 0; i < 15; i++) {
  const num1 = Math.floor(Math.random() * 999) + 10; // 3-digit number
  const num2 = Math.floor(Math.random() * 999) + 10; // 3-digit number
  const operator = Math.random() < 0.5 ? '+' : '-'; // Randomly choose addition or subtraction
  const expression = `${num1} ${operator} ${num2}`;
  const answer = eval(expression); // Evaluate the expression to get the answer

  questions.push({ question: expression, answer });
}

let currentQuestionIndex = 0;
let startTime;
let endTime;
let score = 0;

function startQuiz() {
  startTime = new Date().getTime();
  displayQuestion();
  updateScoreboard();

  // Listen for the Enter key to submit answers
  document.getElementById('answerInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      submitAnswer();
    }
  });
}

function displayQuestion() {
  const questionElement = document.getElementById('question');
  const answerInput = document.getElementById('answerInput');

  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  answerInput.value = ''; // Clear the answer input field
}

function submitAnswer() {
  const answerInput = document.getElementById('answerInput');
  const userAnswer = parseInt(answerInput.value, 10);

  handleAnswer(userAnswer);
}

function handleAnswer(userAnswer) {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion && userAnswer === currentQuestion.answer) {
    // Correct answer
    score += 1;
  } else if (currentQuestion) {
    // Wrong answer
    score -= 2;
  }

  // Move to the next question or end the quiz
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }

  // Update real-time score
  updateRealTimeScore();
}

function updateScoreboard() {
  const scoreboardElement = document.getElementById('scoreboard');
  scoreboardElement.innerHTML = `<h3>Score: </h3>`;
}


function updateRealTimeScore() {
  const realTimeScoreElement = document.getElementById('realTimeScore');
  if (!realTimeScoreElement) {
    // Create a new element if it doesn't exist
    const newElement = document.createElement('div');
    newElement.id = 'realTimeScore';
    newElement.textContent = `Real-Time Score: ${score}`;
    document.querySelector('.quiz-container').appendChild(newElement);
  } else {
    // Update the existing element
    realTimeScoreElement.textContent = `Real-Time Score: ${score}`;
  }
}

function endQuiz() {
  endTime = new Date().getTime();
  const totalTime = Math.floor((endTime - startTime) / 1000); // Convert to seconds

  // Display results in a popup window
  const popupContent = `
    <h2>Quiz Results</h2>
    <p>Total Score: ${30}</p>
    <p>Achieved Score: ${score}</p>
    <p>Total Time Taken: ${totalTime} seconds</p>
  `;

  const popupWindow = window.open('', 'Quiz Results', 'width=400,height=300');
  popupWindow.document.body.innerHTML = popupContent;
}

// Start the quiz
startQuiz();
