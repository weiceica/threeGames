// get n declare vars
const board = document.getElementById("boardID");
const ctx = board.getContext('2d');



// we need rectangles and circles
function drawRectangle(col, topLeft, topRight, bottomLeft, bottomRight){
    ctx.fillStyle = col;
    ctx.fillRect(topLeft, topRight, bottomLeft, bottomRight);
}
function drawCircle(col, xCord, yCord, rad){
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(xCord, yCord, rad, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}
function writeText(col, text, xCord, yCord){
    ctx.fillStyle = col;
    ctx.font = "70px Georgia";
    ctx.fillText(text, xCord, yCord);
}



// create the elements 
const paddle1 = {
    x: 0,
    y: board.height/2 - 40,
    width: 15,
    height: 80,
    color: "AZURE",
    score: 0

}
const paddle2 = {
    x: board.width - 15,
    y: board.height/2 - 40,
    width: 15,
    height: 80,
    color: "AZURE",
    score: 0
}
const net = {
    x: board.width/2 - 2.5,
    y: 0,
    width: 5,
    height: board.height,
    color: "AZURE"
}
const ball = {
    x: board.width/2,
    y: board.height/2,
    radius: 16,
    speed: 7,
    velX: 7,
    velY: 7,
    color: "AZURE"
}
function drawPaddle1(){
    drawRectangle(paddle1.color, paddle1.x, paddle1.y, paddle1.width, paddle1.height);
}
function drawPaddle2(){
    drawRectangle(paddle2.color, paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function drawBall(){
    drawCircle(ball.color, ball.x, ball.y, ball.radius);
}
function resetBall(){
    ball.speed = 7;
    ball.x = board.width/2;
    ball.y = board.height/2;
    ball.velX = -ball.velX;
}
function drawNet(){
    drawRectangle(net.color, net.x, net.y, net.width, net.height);
}
function drawScore(){
    writeText("AZURE", paddle1.score, board.width/4, board.height/6);
    writeText("AZURE", paddle2.score, board.width/4 * 3, board.height/6);
}

// get the two positions of user1 and user 2
board.addEventListener("mousemove", movePaddle);

function movePaddle(e){
    let rectangle = board.getBoundingClientRect();
    paddle1.y = e.clientY - rectangle.top - paddle1.height/2;
}

// detect collision with wall
function collision(ball, paddle){
    paddle.top = paddle.y;
    ball.top = ball.y - ball.radius;
    
    paddle.bottom = paddle.y + paddle.height;
    ball.bottom = ball.y + ball.radius;

    paddle.left = paddle.x;
    ball.left = ball.x - ball.radius;

    paddle.right = paddle.x + paddle.width;
    ball.right = ball.x + ball.radius;

    if(paddle.left >= ball.right) return false;
    if(paddle.top >= ball.bottom) return false;
    if(paddle.right <= ball.left) return false;
    if(paddle.bottom <= ball.top) return false;
    return true;
}

function calcScore(){
    if(ball.x + ball.radius > board.width){
        paddle1.score++;
        resetBall();
    }
    else if(ball.x - ball.radius < 0){
        paddle2.score++;
        resetBall();
    }
}

function checkPaddleHit(){
    let p = (ball.x + ball.radius < board.width/2) ? paddle1 : paddle2;
    if(collision(ball, p)){
        let collidePoint = (ball.y - (p.y + p.height/2));
        collidePoint = collidePoint / (p.height/2);

        let angle = collidePoint * (Math.PI/4);
        let dir = (ball.x + ball.radius < board.width/2) ? 1 : -1;
        ball.velX = ball.speed * dir * Math.cos(angle);
        ball.velY = ball.speed * Math.sin(angle);
        ball.speed += 0.3;
    }
}

function render(){
    drawRectangle("BLACK", 0, 0, board.width, board.height);
    drawScore();
    drawNet();
    drawPaddle1();
    drawPaddle2();
    drawBall();
}
function update(){
    calcScore();

    ball.x += ball.velX;
    ball.y += ball.velY;

    // creating a simple AI TODO: make a better version of this AI
    paddle2.y += ((ball.y - (paddle2.y + paddle2.height/2)))*0.1;
    
    // hit bot
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > board.height){
        ball.velY = -ball.velY;
    }

    checkPaddleHit();
}

function main(){
    update();
    render();
}
const fps = 100;
setInterval(main, 1000/fps); // fps = 100
