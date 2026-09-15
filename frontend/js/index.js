// ===========================
// CONSTANTS
// ===========================
const LAST_FORM_INDEX = 2;
const LAST_QUESTION_INDEX = 19;
const ENDPOINT = '';
const POINTS_PER_QUESTION = 3;
let answerdQuestions = 0
let questionsPassed = 0
let wrongAnswer = 5
let isMuted = false

// ===========================
// STATE MANAGEMENT
// ===========================
const gameState = {
  intro: {name: ''},
  difficulty: '',
  duration: {
    minutes: 0,
    seconds: 0},
  config: {
    difficulty: '',
    topic: [],
    questions: ''},
  currentQuestionIndex: 0,
  currentIndex: 0,
  points: 0,
  questions: null,
  answeredCurrentQuestion: false,
  chosenQuestions: null
};

const timerState = {
  minutes: 0,
  seconds: 0,
  intervalId: null,
  isRunning: false
};

// ===========================
// DOM ELEMENT CACHE
// ===========================
const elements = {
  forms: null,
  dialog: null,
  beginButton: null,
  intro: null,
  timerDisplay: null,
  score: null,
  difficulty: null,
  response: null,
  questionsDisplay: null,
  questionBox: null,
  questionContainer: null,
  optionsContainer: null,
  nextButton: null,
  quizEnd: null,
  retryQuiz: null,
  newQuiz: null,
  bgAudio: null,
  correctAudio: null,
  wrongAudio: null,
  muteAudio: null,
  tracks: null,
  gameOver: null,
  endGame: null
};

// ===========================
// INITIALIZATION
// ===========================
function init() {
  // Cache all DOM elements
  cacheElements();
  
  // Validate required elements exist
  if (!validateDOM()) {
    console.error('Required DOM elements not found');
    return}
  // Setup event listeners
  setupFormHandlers()
  setupBeginButtonHandler()
  
  // Show initial form
  showInitialForm()}

// Cache all DOM elements at startup
function cacheElements() {
  elements.forms = document.querySelectorAll('.data');
  elements.dialog = document.getElementById('dialog');
  elements.beginButton = document.getElementById('begin');
  elements.timerDisplay = document.getElementById('timer');
  elements.questionsDisplay = document.getElementById('stage');
  elements.questionContainer = document.getElementById('question');
  elements.questionBox = document.getElementById('question-box')
  elements.response = document.getElementById('response')
  elements.nextButton = document.getElementById('nextQuestion');
  elements.score = document.getElementById('score');
  elements.difficulty = document.getElementById('difficultyIndicator')
  elements.quizEnd = document.getElementById('quizEnd');
  elements.retryQuiz = document.getElementById('retry');
  elements.newQuiz = document.getElementById('newQuiz');
  elements.intro = document.getElementById('intro');
  elements.bgAudio = document.getElementById('bgAudio')
  elements.correctAudio = document.getElementById('correctAudio')
  elements.wrongAudio = document.getElementById('wrongAudio')
  elements.muteAudio = document.getElementById('muteAudio')
  elements.tracks = document.querySelectorAll('.tracks')
  elements.gameOver =document.getElementById('gameOver')
  elements.endGame =document.getElementById('endGame')
  
  // Note: optionsContainer will be queried fresh each time we need it
}

// Validate that all required DOM elements exist
function validateDOM() {
  const optionsCheck = document.querySelectorAll('.option');
  
  return (
    elements.forms?.length > 0 &&
    elements.dialog &&
    elements.beginButton &&
    elements.timerDisplay &&
    elements.questionsDisplay &&
    elements.questionContainer &&
    optionsCheck?.length > 0 &&
    elements.nextButton &&
    elements.score &&
    elements.quizEnd
  );
}

// Determine and show the appropriate initial form
function showInitialForm() {
  const startIndex = 0
  
  if (elements.forms[startIndex]) {
    elements.forms[startIndex].classList.add('active');
  }
}

// ===========================
// FORM HANDLING
// ===========================
function setupFormHandlers() {
  elements.forms.forEach((form, index) => {
    form.addEventListener('submit', (event) =>{
      event.preventDefault();
      try{
      // Process form data
      processFormData(form);
      form.classList.remove('active');
      // Navigate to next step
      navigateToNextStep(index, LAST_FORM_INDEX)
      }catch (err){alert(err)}
})})}

function processFormData(form) {
  const formData = new FormData(form);
  const formId = form.getAttribute('id')
  if(gameState[formId]){
  formData.forEach((value, fieldName) => {
  const trimmedValue=String(value).trim();
  if(Array.isArray(gameState[formId][fieldName])){ gameState[formId][fieldName].push(trimmedValue)}
  else{gameState[formId][fieldName]=trimmedValue}
})}else{alert('couldnt update, parameter does not exist')}
  Object.keys(gameState[formId]).forEach(key =>{
    if (gameState[formId][key].length==0) throw new Error(`fill in missing field  ${key} `)})
}

function navigateToNextStep(currentIndex, finalIndex) {
  const nextIndex = currentIndex + 1;
  
  if (nextIndex <= finalIndex) {
    // Show next form
    if (elements.forms[nextIndex]) {
      elements.forms[nextIndex].classList.add('active');
    }
  } else {
    // All forms completed - show dialog and load questions
    elements.questionContainer.textContent = 'loading Questions'
    elements.endGame.addEventListener('click', endQuiz)
    showSummaryDialog();
  }
}

// ===========================
// DIALOG & QUESTION LOADING
// ===========================
async function showSummaryDialog() {
  const nameEl = elements.dialog.querySelector('[data-summary="name"]');
  const difficultyEl = elements.dialog.querySelector('[data-summary="difficulty"]');
  const durationEl = elements.dialog.querySelector('[data-summary="duration"]');
  
  if (nameEl) nameEl.textContent = gameState.intro.name;
  if (difficultyEl) difficultyEl.textContent = gameState.config.difficulty;
  if (durationEl) {
    durationEl.textContent = `${gameState.duration.minutes}m ${gameState.duration.seconds}s`;
  elements.muteAudio.classList.add('hide')
  elements.muteAudio.addEventListener('click', mute)
  // Load questions BEFORE showing dialog
  try {
    await loadQuestions(ENDPOINT, gameState.config);
    
    // Show dialog after questions are loaded
    if (elements.dialog.showModal) {
      elements.dialog.showModal();
    } else {
      elements.dialog.setAttribute('open', '')}
  } catch (error) {
    alert(`Failed to load questions: ${error.message}`);
    console.error('Question loading error:', error);
  }
    
  }}

function mute(){
  if(!isMuted){
    elements.tracks.forEach(track=>{
      track.muted = true
    })
    elements.muteAudio.textContent='unmute'
    isMuted = true
  }else{
    elements.tracks.forEach(track=>{
      track.muted = false
    })
    elements.muteAudio.textContent='mute'
    isMuted = false
  }
}

async function loadQuestions(endpoint, headers) {
  try {
    const response = await fetch('placeholder');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    gameState.questions = await response.json();
    
    // Validate questions structure
    if (!Array.isArray(gameState.questions) || gameState.questions.length === 0) {
      throw new Error('Invalid questions format');
    }
    
    console.log(`Loaded ${gameState.questions.length} questions`);
  } catch (error) {
    throw new Error(`Failed to load questions: ${error.message}`);
  }
}

// ===========================
// GAME START & TIMER
// ===========================
function setupBeginButtonHandler() {
  elements.beginButton.addEventListener('click', countdown);
}
function countdown(){
  let start = 3
  // Close dialog
  elements.dialog.close();
  elements.intro.classList.add('active')
  // Reset game state
  resetGameState();
  let cloth = setInterval(()=>{
    start-=1
    elements.intro.textContent = start
  if (start === 0){
    elements.intro.classList.remove('active')
    clearInterval(cloth)
    start = 3
    elements.intro.textContent = start
    startGame()
}
}, 1000)
}
function startGame() {
  elements.bgAudio.play()
  elements.bgAudio.volume = 0.2
  // Initialize timer from configuration
  timerState.minutes = gameState.duration.minutes;
  timerState.seconds = gameState.duration.seconds;
  
  // Show quiz interface
  elements.questionsDisplay.classList.add('active');
  
  // Display first question
  displayCurrentQuestion();
  
  // Start countdown
  startTimer();
  
  // Setup next button handler (only once)
  setupNextButtonHandler();
}

function resetGameState() {
  questionsPassed = 0
  answerdQuestions = 0
  gameState.currentIndex = 0;
  gameState.currentQuestionIndex = 0
  gameState.points = 0;
  wrongAnswer = 5
  gameState.answeredCurrentQuestion = false;
  gameState.chosenQuestions = []
  elements.score.textContent = `Points: 0`;
  elements.nextButton.textContent = 'Next Question';
  elements.difficulty.textContent = `Difficulty: ${gameState.config.difficulty}`
}

function startTimer() {
  if (timerState.isRunning) return;
  
  timerState.isRunning = true;
  updateTimerDisplay();
  
  timerState.intervalId = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerState.intervalId !== null) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
  timerState.isRunning = false;
}

function tick() {
  timerState.seconds--;
  
  // Handle minute rollover
  if (timerState.seconds < 0) {
    timerState.seconds = 59;
    timerState.minutes--;
  }
  
  // Check if timer is complete
  if (timerState.minutes < 0) {
    stopTimer();
    handleTimerComplete('Your Time Is Up');
    return;
  }
  
  // Update display
  updateTimerDisplay();
}

function updateTimerDisplay() {
  if (!elements.timerDisplay) return;
  
  const formattedMinutes = String(timerState.minutes).padStart(2, '0');
  const formattedSeconds = String(timerState.seconds).padStart(2, '0');
  
  elements.timerDisplay.textContent = `Time left: ${formattedMinutes}:${formattedSeconds}`;
}

function handleTimerComplete(message) {
  elements.questionsDisplay.classList.remove('active');
  document.getElementById('reason').textContent = message
  elements.gameOver.classList.add('active')
}

// ===========================
// QUESTION DISPLAY (FIXED!)
// ===========================
function displayCurrentQuestion() {
  const currentIndex = gameState.currentIndex
  let selectedQuestion = (Math.floor(Math.random() * gameState.questions.length)) - 1;
  while (gameState.chosenQuestions.includes(selectedQuestion) || selectedQuestion === -1){
  selectedQuestion = (Math.floor(Math.random() * gameState.questions.length)) - 1;
  }
  const question = gameState.questions[selectedQuestion];
  gameState.chosenQuestions.push(selectedQuestion)
  gameState.currentQuestionIndex = selectedQuestion
  const currentQuestionIndex = gameState.currentQuestionIndex
  // Reset answered state for new question
  gameState.answeredCurrentQuestion = false;
  
  // Display question text
  elements.questionContainer.textContent = 
    `${currentIndex + 1}. ${question.question}`;
  
  // Display options with FRESH DOM query
  displayOptions(question, currentQuestionIndex);
  
  // Update next button text
  updateNextButtonText();
}

function displayOptions(question, questionIndex) {
  // ✅ CRITICAL FIX: Query fresh NodeList each time
  const optionElements = document.querySelectorAll('.option');
  
  elements.response.classList.remove('correct', 'wrong');
  elements.questionBox.classList.remove('correct', 'wrong');
  optionElements.forEach((option, optionIndex) => {
    // Set option text
    option.textContent = question.options[optionIndex];
    
    // Remove any previous styling
    option.classList.remove('correct', 'wrong', 'disabled');
    
    // Store question and option index as data attributes
    option.dataset.questionIndex = questionIndex;
    option.dataset.optionIndex = optionIndex;
  });
  
  // Remove old event listeners and add new ones using event delegation
  // This is more efficient than adding individual listeners
  setupOptionClickHandlers();
}

// ✅ NEW: Event delegation pattern for options
let optionClickHandler = null;

function setupOptionClickHandlers() {
  // Remove existing handler if present
  if (optionClickHandler) {
    elements.questionsDisplay.removeEventListener('click', optionClickHandler);
  }
  
  // Create new handler with current question context
  optionClickHandler = (event) => {
    const option = event.target.closest('.option');
    
    if (!option) return;
    
    // Prevent multiple answers
    if (gameState.answeredCurrentQuestion) return;
    
    // Get indices from data attributes
    const questionIndex = parseInt(option.dataset.questionIndex);
    const optionIndex = parseInt(option.dataset.optionIndex);
    
    // Validate we're answering the current question
    if (questionIndex !== gameState.currentQuestionIndex) return;
    
    handleOptionClick(questionIndex, optionIndex);
  };
  
  // Add single delegated listener to parent
  elements.questionsDisplay.addEventListener('click', optionClickHandler);
}

function handleOptionClick(questionIndex, optionIndex) {
  // Prevent multiple answers
  if (gameState.answeredCurrentQuestion) return;
  
  gameState.answeredCurrentQuestion = true;
  
  // Validate answer
  validateAnswer(questionIndex, optionIndex, elements.response);
  
  // Disable all options visually
  const optionElements = document.querySelectorAll('.option');
  optionElements.forEach(option => {
    option.classList.add('disabled');
  });
}

function validateAnswer(questionIndex, optionIndex, feedback) {
  const question = gameState.questions[questionIndex];
  const isCorrect = optionIndex === question.correct;
  
  // Get fresh option elements
  const optionElements = document.querySelectorAll('.option');
  
  // Visual feedback on the clicked option
  optionElements[optionIndex].classList.add(
    isCorrect ? 'correct' : 'wrong'
  );
  isCorrect ? elements.correctAudio.play() : elements.wrongAudio.play()
  feedback.classList.add(isCorrect ? 'correct' : 'wrong')
  elements.questionBox.classList.add(isCorrect ? 'correct' : 'wrong')
  feedback.textContent = isCorrect ? 'correct ✔️' : 'wrong ❌️'
  answerdQuestions++
  
  if (isCorrect) {
    gameState.points += POINTS_PER_QUESTION;
    elements.score.textContent = `Points: ${gameState.points}`;
    questionsPassed++
  } else {
    optionElements[question.correct].classList.add('correct');
    wrongAnswer -= 1
    maxTriesReached()
  }
}
function maxTriesReached(){
  if(gameState.difficulty=='endless' && wrongAnswer == 0){
  handleTimerComplete("You've Failed 5 Questions")
  }
}
function setupNextButtonHandler() {
  // Remove any existing listener by cloning
  const newButton = elements.nextButton.cloneNode(true);
  elements.nextButton.parentNode.replaceChild(newButton, elements.nextButton);
  elements.nextButton = newButton;
  
  // Add single listener
  elements.nextButton.addEventListener('click', handleNextQuestion);
}

function handleNextQuestion() {
  gameState.currentIndex++;
  
  if (gameState.difficulty!='endless' && gameState.currentIndex <= LAST_QUESTION_INDEX) {
    displayCurrentQuestion();
  }else if(gameState.difficulty=='endless'){
    displayCurrentQuestion();
  }else {
    endQuiz();
  }
}

function updateNextButtonText() {
  if (gameState.difficulty !=='endless' && gameState.currentIndex === LAST_QUESTION_INDEX) {
    elements.nextButton.textContent = 'Finish Quiz';
  } else {
    elements.nextButton.textContent = 'Next Question';
  }
}

// QUIZ END
function endQuiz() {
  stopTimer();
  
  // Remove option click handler
  if (optionClickHandler) {
    elements.questionsDisplay.removeEventListener('click', optionClickHandler);
    optionClickHandler = null;
  } 
  clearScreen()
  // Display final score
   displayFinalScore();
[ ]}
function clearScreen(){
  elements.questionsDisplay.classList.remove('active');
  elements.gameOver.classList.remove('active');
  elements.quizEnd.classList.add('active');
}
function displayFinalScore() {
  const finalScoreElement = elements.quizEnd.querySelector('#finalScore');
  const numberAnswered = elements.quizEnd.querySelector('#answered');
  const numberPassed = elements.quizEnd.querySelector('#passed');
  const numberfailed = elements.quizEnd.querySelector('#failed');
  const analyses = elements.quizEnd.querySelector('#analysis');
  if (finalScoreElement) {
    let totalPossible = 0
    let scoreAnimation = setInterval(pee, 100)
    const highScore = parseInt(checkHighScore())

    
    function pee(){
    const percentage = Math.round((totalPossible / 60) * 100);
      if (gameState.difficulty != 'endless'){
      finalScoreElement.textContent = `${totalPossible} (${percentage}%)/60`;
      numberfailed.textContent = `Number of Questions Failed: ${(LAST_QUESTION_INDEX+1) - questionsPassed}`
      analyses.textContent = analysis(gameState.points)
    }else{
      finalScoreElement.textContent = `${totalPossible}`
      numberfailed.textContent = `Number of Questions Failed: ${answerdQuestions - questionsPassed}`
      if (gameState.points > highScore){
        analyses.textContent = 'New High Score'
        localStorage.setItem('highScore', String(gameState.points))
      }else{
        analyses.textContent=`Your High Score: ${highScore}`
      }
    }
      if(totalPossible < gameState.points){
        totalPossible++
      }else{
        clearInterval(scoreAnimation)
      }
    }
    numberAnswered.textContent = `Number of Questions Answered: ${answerdQuestions}`
    numberPassed.textContent = `Number of Questions Passed: ${questionsPassed}`
    elements.newQuiz.addEventListener('click', ()=>{location.reload()})
    elements.retryQuiz.addEventListener('click', retake)
  }
}

function analysis(score){
  if (score <= 15){
    return 'Your Score is Very Low'
  }else if(score <= 29){
    return 'Your Made Below Average'
  }else if (score == 30){
    return 'You Hit The Mid-point Mark'
  }else if(score <= 59){
    return 'You Made More Than Half'
  }else{
    return 'You Had a Perfect Score'
  }
}

function checkHighScore(){
  const highScore = localStorage.getItem('highScore')
  if(!highScore){
    localStorage.setItem('highScore', '0')
  }
  return highScore
}

function retake(){
  elements.quizEnd.classList.remove('active')
  showSummaryDialog();
}
// CLEANUP
function cleanup() {
  stopTimer();
  
  // Remove option click handler if exists
  if (optionClickHandler && elements.questionsDisplay) {
    elements.questionsDisplay.removeEventListener('click', optionClickHandler);
    // elements.retryQuiz.addEventListener('click', retake)
  }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', cleanup);