const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{x:9*box, y:9*box}];
let direction = "RIGHT";

let food = {
    x: Math.floor(Math.random()*15)*box,
    y: Math.floor(Math.random()*15)*box
};

document.addEventListener("keydown", changeDirection);

function changeDirection(e){
    if(e.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
    if(e.keyCode == 38 && direction != "DOWN") direction = "UP";
    if(e.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
    if(e.keyCode == 40 && direction != "UP") direction = "DOWN";
}

function draw(){
    ctx.fillStyle = "#0b1e35";
    ctx.fillRect(0,0,300,300);

    for(let i=0;i<snake.length;i++){
        ctx.fillStyle = i==0 ? "lime" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction=="LEFT") snakeX -= box;
    if(direction=="UP") snakeY -= box;
    if(direction=="RIGHT") snakeX += box;
    if(direction=="DOWN") snakeY += box;

    if(snakeX==food.x && snakeY==food.y){
        food = {
            x: Math.floor(Math.random()*15)*box,
            y: Math.floor(Math.random()*15)*box
        };
    } else {
        snake.pop();
    }

    let newHead = {x:snakeX, y:snakeY};

    if(snakeX<0 || snakeY<0 || snakeX>=300 || snakeY>=300){
        clearInterval(game);
        alert("Game Over");
    }

    snake.unshift(newHead);
}

let game = setInterval(draw,100);
