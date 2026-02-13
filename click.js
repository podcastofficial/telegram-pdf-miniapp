let score = 0;
let timeLeft = 10;
let gameActive = true;

function increaseScore() {
    if(gameActive){
        score++;
        document.getElementById("score").innerText = "Score: " + score;
    }
}

let timer = setInterval(function(){
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;

    if(timeLeft <= 0){
        clearInterval(timer);
        gameActive = false;
        alert("Game Over! Your Score: " + score);
    }

}, 1000);
