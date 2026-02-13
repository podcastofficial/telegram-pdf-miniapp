let randomNumber = Math.floor(Math.random() * 10) + 1;

function checkGuess(){
    let userGuess = parseInt(document.getElementById("guessInput").value);
    let result = document.getElementById("result");

    if(userGuess === randomNumber){
        result.innerText = "🎉 Correct! You Win!";
    } else {
        result.innerText = "❌ Wrong! Try Again.";
    }
}
