fetch('./question.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch JSON data');
    }
    return response.json();
  })
  .then(data => {
    const questions = data;

    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      nextButton.innerHTML = "Next";
      showQuestions();
    }

    function showQuestions() {
      resetState();
      const currentQuestion = questions[currentQuestionIndex];
      const questionNo = currentQuestionIndex + 1;
      questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

      currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
          button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
      });
    }

    function resetState() {
      nextButton.style.display = "none";
      while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
      }
    }

    function selectAnswer(e) {
      const selectedBtn = e.target;
      const isCorrect = selectedBtn.dataset.correct === 'true';
      if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
      } else {
        selectedBtn.classList.add("incorrect");
      }
      Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
      });
      setTimeout(handleNextButton, 1000);
    }

    function showScore() {
      resetState();
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = `<a class="anchor-link" href="leaderboard.html">View Leaderboard</a>`;
      nextButton.style.display = "block";
      apiFetch(score);
    }

    function handleNextButton() {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestions();
      } else {
        showScore();
      }
    }

    nextButton.addEventListener("click", () => {
      if (currentQuestionIndex < questions.length) {
        handleNextButton();
      } else {
        startQuiz();
      }
    });

    startQuiz();

    async function apiFetch(score) {
      try {
        const response = await fetch('/score', {
          method: 'POST',
          body: JSON.stringify({ score }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        // Handle the result as needed
      } catch (error) {
        console.error('Error:', error);
      }
    }
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
  });
