//board 
let board;
let boardWidth = 750 ; 
let boardHeight = 300;
let context;
//chicken 
let chickenWidth = 88; 
let chickenHeight = 94; 
let chickenX = 50;  
let chickenY = boardHeight - chickenHeight; 
let chickenImg;

let chicken = {
    x : chickenX,
    y : chickenY,
    width : chickenWidth,
    height : chickenHeight
}
//plant 
let plantArray = [];

let plant1Width = 40; 
let plant2Width = 73; 
let plant3Width = 99; 

let plantHeight = 78;
let plantX = 700; 
let plantY = boardHeight - plantHeight; 

let plant1Img;
let plant2Img;
let plant3Img;
//physics
let velocityX = -8; 
let velocityY = 0;
let gravity = .4;

let gameOver = false; 
let score = 0;
let highScore = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); 
    
    chickenImg = new Image();
    chickenImg.src = "./Chicken Run Assets/Chicken Run.png";
    chickenImg.onload = function(){
        context.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    }
    
    plant1Img = new Image();
    plant1Img.src = "./Chicken Run Assets/Sunflower.png";

    plant2Img = new Image();
    plant2Img.src = "./Chicken Run Assets/Shrub.png";

    plant3Img = new Image();
    plant3Img.src = "./Chicken Run Assets/Green Bush.png";

    requestAnimationFrame(update);
    setInterval(placePlant, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveChicken)
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    //chicken jump
    velocityY += gravity;
    chicken.y = Math.min(chicken.y + velocityY, chickenY); 
    context.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    //plant 
    for (let i= 0; i < plantArray.length; i++){
        let plant = plantArray[i];
        plant.x += velocityX;
        context.drawImage(plant.img, plant.x, plant.y, plant.width, plant.height);
    
        if(detectCollision(chicken, plant)){
            if(score > highScore){
                highScore = score + 1;
            }
            localStorage.setItem("highScore", highScore);
            gameOver = true;
            chickenImg.src = "./Chicken Run Assets/Chicken Run Game Over.png";
            chickenImg.onload = function(){
                context.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
            }
        }
    }
    //score
    loadHighScore();
    context.fillStyle="black";
    context.font="15px sans-serif";
    score ++;
    context.fillText("High score: " + highScore + "  Score: " + score, 10, 30); 
    
    function loadHighScore(){
        if(localStorage.getItem("highScore") != null)
        {
            highScore = localStorage.getItem("highScore");
        }
    }
}
//restart 
const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", restartGame);

function restartGame(){ 
    location.reload();
}

function moveChicken(e){
    
    if(gameOver){
        return;
    }
    
    if((e.code == "Space" || e.code == "ArrowUp") && chicken.y == chickenY){
        //jump
        velocityY = -10;
    }
}
function placePlant(){
    
    if(gameOver){
        return;
    }
   
    let plant = {
        img : null,
        x : plantX,
        y : plantY,
        width : null,
        height : plantHeight
    }
    
    let placePlantChance = Math.random(); 
    
    if(placePlantChance > .90){ //10% you get plant 3
        plant.img = plant3Img;
        plant.width = plant3Width;
        plantArray.push(plant);
    }
    else if(placePlantChance > .70){ //30% you get plant 2
        plant.img = plant2Img;
        plant.width = plant2Width;
        plantArray.push(plant);
    }
    else if(placePlantChance > .50){ //50% you get plant 1
        plant.img = plant1Img;
        plant.width = plant1Width;
        plantArray.push(plant);
    }
    //removes the plant 
    if(plantArray.length > 5){
        plantArray.shift(); 
    }
}
//hit boxes
function detectCollision(a, b){
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}
