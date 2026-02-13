let startTime;

function startGame(){
    document.getElementById("result").innerText = "";
    setTimeout(function(){
        document.getElementById("box").style.display = "block";
        startTime = Date.now();
    }, Math.random() * 3000);
}

function stopGame(){
    let reactionTime = Date.now() - startTime;
    document.getElementById("box").style.display = "none";
    document.getElementById("result").innerText =
    "⏱ Your Reaction Time: " + reactionTime + " ms";
}
