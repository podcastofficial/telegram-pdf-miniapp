function play(userChoice){
    const choices = ["rock","paper","scissors"];
    const botChoice = choices[Math.floor(Math.random()*3)];
    let result = "";

    if(userChoice === botChoice){
        result = "😐 Draw!";
    }
    else if(
        (userChoice === "rock" && botChoice === "scissors") ||
        (userChoice === "paper" && botChoice === "rock") ||
        (userChoice === "scissors" && botChoice === "paper")
    ){
        result = "🎉 You Win!";
    }
    else{
        result = "🤖 Bot Wins!";
    }

    document.getElementById("result").innerText =
    "Bot chose: " + botChoice + " | " + result;
}
