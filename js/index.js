// 点击开始游戏，startpage 消失，游戏开始
//  随即出现食物，出现三节蛇开始运动
// 上下左右 g根据按键改变运动方向
// 判断是否吃到食物，蛇+1
// 判断游戏结束，弹窗框
var map = document.getElementsByClassName('content')[0];
var start = document.getElementsByClassName('startBtn')[0];
var pause = document.getElementsByClassName('pause')[0];
var leftSide = document.getElementsByClassName('left-side')[0];
var startPage = document.getElementsByClassName('startPage')[0];
var loser = document.getElementsByClassName('loser')[0];
var score = document.getElementsByClassName('score');
var closeBtn = document.getElementsByClassName('closeBtn')[0];
var gamerun = true;
var timer;
function init(){
    // map
    this.map = map;
    this.mapW = map.offsetWidth;
    this.mapH = map.offsetHeight;
    // apple
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    // snake
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [['head',5,1],['body',4,1],['body',3,1]];
    // 游戏属性
    this.direct = 'right';
    this.right = false;
    this.left = false;
    this.up = true;
    this.down = true;
    this.end = false;
}
init();
bindEvent();
function startGame(){
    startPage.style.display = 'none';
    leftSide.style.display = 'block';
    createFood();
    createSnake();
}
function createFood(){
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random() * (this.mapW / 20 - 1));
    this.foodY = Math.floor(Math.random() * (this.mapH / 20 - 1));
    judgeFoodP(this.foodX,this.foodY);
    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';
    food.className = 'food';
    map.appendChild(food);
}
function judgeFoodP(foodX,foodY){
    var len = this.snakeBody.length;
    for(var i = 0;i < len;i++){
        if(this.snakeBody[i][1] == foodX && this.snakeBody[i][2] == foodY){
            this.foodX = Math.floor(Math.random() * (this.mapW / 20 - 1));
            this.foodY = Math.floor(Math.random() * (this.mapH / 20 - 1));
            judgeFoodP(this.foodX,this.foodY);
        }
    }
}
function createSnake(){
    var len = this.snakeBody.length;
    for(var i = 0;i <len;i++){
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][1] * 20 + 'px';
        snake.style.top = this.snakeBody[i][2] * 20 + 'px';
        snake.className = this.snakeBody[i][0] + ' snake';
        switch(this.direct){
            case 'right': break;
            case 'up':
                snake.style.transform = 'rotateZ(-90deg)';
                break;
            case 'left': 
                snake.style.transform = 'rotateZ(180deg)';
                break;
            case 'down': 
                snake.style.transform = 'rotateZ(90deg)';
                break;
        }
        map.appendChild(snake);
    }
}
function move(){
    var len = this.snakeBody.length;
    for(var i = len - 1; i > 0; i--){
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
        this.snakeBody[i][2] = this.snakeBody[i - 1][2];
    }
    switch(this.direct){
        case 'right': 
            this.snakeBody[0][1] += 1;
            break;
        case 'up': 
            this.snakeBody[0][2] -= 1;
            break;
        case 'left': 
            this.snakeBody[0][1] -= 1;
            break;
        case 'down': 
        this.snakeBody[0][2] += 1;
        break;
    }
    removeSnake('snake');
    createSnake();
    hitSelf();
}
function removeSnake(className){
    var ele = document.getElementsByClassName(className);
    while(ele.length > 0){
        ele[0].parentNode.removeChild(ele[0]);
    }
}
function setDirect(code){
    switch(code){
        case 37:
        if(this.left){
            this.direct = 'left';
            this.left = false;
            this.right = false;
            this.up = true;
            this.down = true;
        };break;
        case 38:
        if(this.up){
            this.direct = 'up';
            this.left = true;
            this.right = true;
            this.up = false;
            this.down = false;
        };break;
        case 39:
        if(this.right){
            this.direct = 'right';
            this.left = false;
            this.right = false;
            this.up = true;
            this.down = true;
        };break;
        case 40:
        if(this.down){
            this.direct = 'down';
            this.left = true;
            this.right = true;
            this.up = false;
            this.down = false;
        };break;
        default:
        break;
    }
}
function bindEvent(){
    document.onkeydown = function(e){
        var code = e.keyCode;
        setDirect(code);
    }
    start.onclick = function(){
        startGame();
        getScore();
        timer = setInterval(function(){
            move();
            eatFood();
            gameOver();
        },200);
    }
    closeBtn.onclick = function(){
        startPage.style.display = 'block';
        loser.style.display = 'none';
        leftSide.style.display = 'none';
        removeSnake('food');
        removeSnake('snake');
        init();
    }
    pause.onclick = function(){
        pauseGame();
    }
}
function gameOver(){
    if(this.snakeBody[0][1] * 20 < 0 || 
       this.snakeBody[0][1] * 20 > this.mapW || 
       this.snakeBody[0][2]* 20 < 0 || 
       this.snakeBody[0][2] * 20 > this.mapH || this.end){
        clearInterval(timer);
        loser.style.display = 'block';
    }
}
function hitSelf(){
    var len = this.snakeBody.length;
    for(var i = 1; i < len; i++){
        if(this.snakeBody[i][1] == this.snakeBody[0][1] && this.snakeBody[i][2] == this.snakeBody[0][2]){
            this.end = true;
        }
    }
}
function eatFood(){
    if(Math.abs(this.snakeBody[0][1] - this.foodX) < 1 && 
       Math.abs(this.snakeBody[0][2] - this.foodY) < 1){
        removeSnake('food');
        var len = this.snakeBody.length;
        var lX = this.snakeBody[len - 1][1];
        var lY = this.snakeBody[len - 1][2];
        this.snakeBody.push(['body',lX,lY]);
        createSnake();
        createFood();
        getScore();
    }
}
function getScore(){
    var len = this.snakeBody.length;
    for(var i = 0; i < score.length;i++){
        score[i].innerText = len - 3;
    }
}
function pauseGame(){
    if(gamerun){
        pause.src = './img/start.png';
        clearInterval(timer);
        gamerun = false;
    }else{
        pause.src = './img/pause.png';
        gamerun = true;
        timer = setInterval(function(){
            move();
            eatFood();
            gameOver();
        },200);
    }
}