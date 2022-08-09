// GLOBAL VARS
const snakeSpeed = 8;
let lastRenderTime = 0;
const gameBoard = document.getElementById('gameBoard');
let gameOver = false;
let gamePoints = 1;



// main (whileTrue)
function main(currentTime){
    if(gameOver){
        return alert('you lose, score: ' + gamePoints);
    }
    window.requestAnimationFrame(main);
    const secondsSinceRender = (currentTime - lastRenderTime) / 1000;
    if(secondsSinceRender < 1 / snakeSpeed) return;

    lastRenderTime = currentTime;

    updateFrame();
    drawFrame();
}

window.requestAnimationFrame(main);

function updateFrame(){
    updateSnake();
    updateFood();
    deathCheck();
}

function drawFrame(){
    gameBoard.innerHTML = '';
    drawSnake(gameBoard);
    drawFood(gameBoard);
}



// CORRELATING DEATH CHECK
function deathCheck(){
    let headSnake = snakeBody[0];
    if(headSnake.x < 1 || headSnake.y < 1) gameOver = true;
    if(headSnake.x > 15 || headSnake.y > 15) gameOver = true;
    if(onSnake(headSnake, {ignoreHead: true})) gameOver = true;
}



///ABT THE FKING SNAKE ITSELF
const snakeBody = [{ x: 8, y: 8}];
// snake
function updateSnake(){
    addSnake();
    const input = getInput();
    for(let i = snakeBody.length - 2; i >= 0; --i){
        snakeBody[i + 1] = { ...snakeBody[i] };
    } // for

    snakeBody[0].x += input.x;
    snakeBody[0].y += input.y;
}

function drawSnake(gameBoard){
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);

        const snakeScore = document.createElement('p');
        snakeScore.classList.add('snakeScore');
        snakeElement.appendChild(snakeScore);
        const snakePoints = document.createTextNode(gamePoints);
        snakeScore.appendChild(snakePoints);
    });
}



// ABT THE APPLE
let apple = getRandApple(); // TODO: make random
const expansionRate = 1;
function updateFood(){
    if(onSnake(apple)){
        expandSnake(expansionRate)
        apple = getRandApple(); // TODO: make random
    }
}

function drawFood(){
    const appleElement = document.createElement('div');
    appleElement.style.gridRowStart = apple.y;
    appleElement.style.gridColumnStart = apple.x;
    appleElement.classList.add('apple');
    gameBoard.appendChild(appleElement);
}

function getRandApple(){
    let newRandApple;
    while(newRandApple == null || onSnake(newRandApple)){
        newRandApple = randGridPos();
    } // while
    return newRandApple;
}

function randGridPos(){
    return {
        x: Math.floor(Math.random() * 15) + 1,
        y: Math.floor(Math.random() * 15) + 1
    };
}





// ABT CORRELATING THE APPLE AND THE SNAKE\\
let newSnakes = 0;
function expandSnake(amt){
    newSnakes += amt;
    gamePoints += amt;
}
function onSnake(pos, {ignoreHead = false} = {}){
    return snakeBody.some((segment, index) => {
        if(ignoreHead && index === 0) return false;
        return equPos(segment, pos);
    });
}

function equPos(p1, p2){
    return (p1.x === p2.x && p1.y === p2.y);
}

function addSnake(){
    for(let i = 0; i < newSnakes; ++i){
        snakeBody.push({
            ...snakeBody[snakeBody.length - 1]
        });
    } // for
    newSnakes = 0;
}





// GET INPUT DIRECTIONS
let arrowKey = { x: 0, y: 0};
let lastArrowKey = {x:0, y:0};

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'w':
            if(lastArrowKey.y !== 0) break;

            arrowKey = {x:0, y:-1};
            break;
        case 's':
            if(lastArrowKey.y !== 0) break;
            arrowKey = {x:0, y:1};
            break;
        case 'a':
            if(lastArrowKey.x !== 0) break;
            arrowKey = {x:-1, y:0};
            break;
        case 'd':
            if(lastArrowKey.x !== 0) break;
            arrowKey = {x:1, y:0};
            break;
    }
});

function getInput(){
    lastArrowKey = arrowKey;
    return arrowKey;
}