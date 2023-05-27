
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const resultMessageElement = document.getElementById("result-message");
const nextButton = document.getElementById("next-button");
const toastElement = document.getElementById("toast");

let currentQuestionIndex = 0;
let userScore = 0;
let quizData = [];

// Fetch quiz data from API
async function fetchQuizData() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }
    const data = await response.json();
    quizData = data.results;
    displayQuestion();
  } catch (error) {
    console.log(error);
    questionElement.textContent = "Failed to load quiz data";
  }
}

// Display the current question and choices
function displayQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    choicesElement.innerHTML = ""

  const allChoices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  const shuffledChoices = shuffleArray(allChoices);

  shuffledChoices.forEach(choice => {
    const choiceButton = document.createElement("button");
    choiceButton.classList.add("choice");
    choiceButton.textContent = choice;
    choiceButton.addEventListener("click", handleAnswer);
    choicesElement.appendChild(document.createElement("li")).appendChild(choiceButton);
  });
}

// Handle user's answer selection
function handleAnswer(event) {
  const selectedChoice = event.target;
  const selectedAnswer = selectedChoice.textContent;

  const currentQuestion = quizData[currentQuestionIndex];
  if (selectedAnswer === currentQuestion.correct_answer) {
    userScore++;
    showToast("Correct!", "toast-success");
  } else {
    showToast("Wrong!", "toast-error");
  }
  

  // Disable all choice buttons after selection
  const choiceButtons = document.querySelectorAll(".choice");
  choiceButtons.forEach(button => button.removeEventListener("click", handleAnswer));

  // Display the result message and update score
  resultMessageElement.textContent = `Your score: ${userScore}/${quizData.length}`;
  resultMessageElement.style.display = "block";
  nextButton.style.display = "block";
   // Check if the score is 10/10 to show confetti
   if (userScore === quizData.length) {
    showConfetti();
  }
}


// Proceed to the next question or end the quiz
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    displayQuestion();
    resultMessageElement.style.display = "none";
    nextButton.style.display = "none";
  } else {
    // End of the quiz
    questionElement.textContent = "Quiz completed!";
    choicesElement.innerHTML = "";
  }
}

// Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function showConfetti() {
    const duration = 3000; // Duration of the confetti animation in milliseconds
  
    // Configure confetti settings
    const confettiConfig = {
      particleCount: 100, // Number of confetti particles
      spread: 160, // Spread of the confetti particles
      colors: ["#ff0000", "#00ff00", "#0000ff"], // Colors of the confetti particles
    };
  
    // Trigger the confetti animation
    confetti(confettiConfig);
  
    // Stop the confetti after the specified duration
    setTimeout(() => {
      confetti.reset();
    }, duration);
  }
// Show toast notification
function showToast(message, className) {
  toastElement.textContent = message;
  toastElement.className = className;
  toastElement.classList.add("show");

  setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2000);
}

// Event listener for next button click
nextButton.addEventListener("click", nextQuestion);

// Fetch quiz data on page load
fetchQuizData();
