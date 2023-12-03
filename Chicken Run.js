//board in the canvas
let board;
let boardWidth = 750 ; //sizes of the board
let boardHeight = 300;
let context;
//chicken variables
let chickenWidth = 88; //chicken image size in width
let chickenHeight = 94; //chicken image size in height
let chickenX = 50; //chicken image position in relation to X coordinates 
let chickenY = boardHeight - chickenHeight; 
let chickenImg;
//object properties
let chicken = {
    x : chickenX,
    y : chickenY,
    width : chickenWidth,
    height : chickenHeight
}
//plant variables
let plantArray = [];

let plant1Width = 40; //sunflower
let plant2Width = 73; //shrub
let plant3Width = 99; //green bush

let plantHeight = 78;
let plantX = 700; 
let plantY = boardHeight - plantHeight; 

let plant1Img;
let plant2Img;
let plant3Img;
//physics
let velocityX = -8; //plant moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false; //boolean
let score = 0;
//loads the variables on screen
window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board
    //loads the chicken image
    chickenImg = new Image();
    chickenImg.src = "./Chicken Run Assets/Chicken Run.png";
    chickenImg.onload = function(){
        context.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    }
    //loads the plant images
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
    chicken.y = Math.min(chicken.y + velocityY, chickenY); //apply gravity to current chicken.y, making sure it doesn't exceed the ground
    context.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
    //plant 
    for (let i= 0; i < plantArray.length; i++){
        let plant = plantArray[i];
        plant.x += velocityX;
        context.drawImage(plant.img, plant.x, plant.y, plant.width, plant.height);
    
        if(detectCollision(chicken, plant)){
            gameOver = true;
            chickenImg.src = "./Chicken Run Assets/Chicken Run Game Over.png";
            chickenImg.onload = function(){
                context.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
            }
        }
    }
    //score
    context.fillStyle="black";
    context.font="30px sans-serif";
    score++;
    context.fillText(score, 10, 40); //coordinates of score position
}
const restartButton = document.getElementById("restartButton");
 restartButton.addEventListener("click", restartGame);

function restartGame() { 
    location.reload();
 }
function moveChicken(e){
    //no longer moves the chicken
    if(gameOver){
        return;
    }
    //function to make the chicken jump
    if((e.code == "Space" || e.code == "ArrowUp") && chicken.y == chickenY){
        //jump
        velocityY = -10;
    }
}
function placePlant(){
    //no longer place plants
    if(gameOver){
        return;
    }
    //place plant
    let plant = {
        img : null,
        x : plantX,
        y : plantY,
        width : null,
        height : plantHeight
    }
    //randomizes the placing of plants
    let placePlantChance = Math.random(); //0 - 0.9999...
    //odds in placing plants
    if(placePlantChance > .90){ //10% you get plant 3
        plant.img = plant3Img;
        plant.width = plant3Width;
        plantArray.push(plant);
    }
    else if(placePlantChance > .70){ //30% you get cactus 2
        plant.img = plant2Img;
        plant.width = plant2Width;
        plantArray.push(plant);
    }
    else if(placePlantChance > .50){ //50% you get cactus 1
        plant.img = plant1Img;
        plant.width = plant1Width;
        plantArray.push(plant);
    }
    //removes the plant images to save memory
    if(plantArray.length > 5){
        plantArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}
//creates hit boxes
function detectCollision(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
