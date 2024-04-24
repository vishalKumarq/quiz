import data from './question.json' assert { type: 'json' };
const questions = data;

const questionElement = document.getElementById("question");
const answerbuttons = document.getElementById("answer-buttons") ;
const nextbutton = document.getElementById("next-btn") ;

let currentQuestionIndex=0;
let score=0;

function startQuiz(){
    let currentQuestionIndex=0;
    let score=0;
    nextbutton.innerHTML="Next";
    showQuestions();

}
function showQuestions(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
  
    let questionNo = currentQuestionIndex+1;
    questionElement.innerHTML= questionNo + "." + currentQuestion.question;

    currentQuestion.answers.forEach(answer =>{
        const button = document.createElement("button");
        button.innerHTML=answer.text;
        button.classList.add("btn");
        answerbuttons.appendChild(button);
        if (answer.correct){
            button.dataset.correct=answer.correct;

        }
        button.addEventListener("click",selectAnswer)
    });

}
function resetState(){
    nextbutton.style.display="none";
    while(answerbuttons.firstChild){
        answerbuttons.removeChild(answerbuttons.firstChild);
    }

}
// function selectAnswer(e){
//     const selectedBtn = e.target;
//     const iscorrect = selectedBtn.dataset.correct ==='true';
//     if (iscorrect){
//         selectedBtn.classList.add("correct"); 
//         score++;
//     }else{
//         selectedBtn.classList.add("incorrect"); 
//     }
//     Array.from(answerbuttons.children).forEach(button =>{
//         if(button.dataset.correct=="true"){
//             button.classList.add("correct");
//         }
//         button.disabled =true;
//     })
//     nextbutton.style.display="block";

// }
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    // Add correct/incorrect classes based on the answer
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    // Disable all answer buttons to prevent further interaction
    Array.from(answerbuttons.children).forEach(button => {
        button.disabled = true;
    });

    // Automatically proceed to the next question after a brief delay
    setTimeout(handleNextButton, 1000); // Adjust the delay time as needed
}




// nextbutton event listener hataya hai

function showScore(){
    resetState();
    questionElement.innerHTML=`You scored ${score} out of ${questions.length}!`;
    nextbutton.innerHTML= 
    `<a class="anchor-link" href="leaderboard.html">View Leaderboard</a> `;
    nextbutton.style.display="block";
    apiFetch(score);

}
function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestions();

    }else{
        showScore();
    }

}
nextbutton.addEventListener("click", ()=>{
    if (currentQuestionIndex <questions.length){
        handleNextButton();
    }
    else{
        startQuiz();
    }
})
startQuiz();
const apiFetch =  async(score) => {
        console.log(score)//4

        
             await fetch('/score', {
                method: 'POST',
                body: JSON.stringify({ score }), // Assuming score is a numeric value
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(result => {
            //   alert(result.message);
             
              
            })
            .catch(error => {
              console.error('Error:', error);
            });
          };
          

