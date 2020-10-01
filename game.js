let canvas;
let theCanvas;
let character;
let context;
let bitCoinArray;
//n * m sprite
let n = 4;
let m = 4;

//for debugging
function mouseClicked(){
  character.x = mouseX-100;
  console.log(mouseY-180, game.ground)
  if(mouseY <= game.ground){
    character.y = mouseY-180;
  }
}
class Stages{
  constructor(){
    this.stage1Grounds = [
      new Ground(200, game.ground-200, 200, 200),
      new Ground(720, game.ground-350, 200, 200, 1, 200),
      new Ground(200, game.ground-500, 200, 200)
    ]
    this.stage1Coins = [
      new BitCoin(265, 320, 0) //x, y, index
    ]
    this.stage2Coins = [
      new BitCoin(250, 320, 0),
      new BitCoin(80, 100, 1),
      new BitCoin(1000, 500, 2)
    ]
    this.stage2Grounds = [
      new Ground(250, game.ground-200, 200, 200, 0, 0, 50),
      new Ground(760, game.ground-401, 200, 200),
      new Ground(1200, game.ground-601, 200, 200, 0, 0, 160),
      new Ground(760, game.ground-801, 200, 200)
    ]
    this.groundStages = [this.stage1Grounds,
                         this.stage2Grounds
    ];
    this.coinStages = [this.stage1Coins,
                       this.stage2Coins
    ];
  }
  loadNewStage(){
    bitCoinArray = stages.coinStages[scoreboard.stage-1];
    groundArray = this.groundStages[scoreboard.stage-1];
  }
}
class ScoreBoard{
  constructor(x, y){
    this.stage = 1;
    this.coinsCollected = 0;
    this.x = x;
    this.y = y;
    this.color = '#000'
  }
  draw(){
    fill(this.color)
  .strokeWeight(0)
   .textSize(20);
    textFont(arcadeFont);
    text(`BitCoins ${this.coinsCollected}\nStage    ${this.stage}`, this.x, this.y);
  }
}
class Game{
  constructor(){
    this.count = 0;
    this.delay = 15;
    this.ground = theCanvas.height*0.90;
    this.grassColor = "#7EC850";
    this.skyColor = "#D1EEFE";
    this.gravity = 0.2;
  }
}

class BitCoin{
  constructor(x, y, i){
    this.index = i;
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.left = this.x;
    this.right = this.x+this.width;
    this.bottom = this.y + this.height;
    this.top = this.y;
  }
  draw(){
    image(bitCoinImage, this.x, this.y, this.width, this.height);
  }
  isHit(){
    character.top = character.y;
    character.bottom = character.y+character.height;
    character.left = character.x;
    character.right = character.x+character.width;
    this.left = this.x;
    this.right = this.x+this.width;
    this.bottom = this.y + this.height;
    this.top = this.y;
    let higherThanCoin= character.bottom < this.top+20;
    let lowerThanCoin = character.top > this.top-20;
    let leftOfCoin = character.right < this.left+70;
    let rightOfCoin = character.left > this.right-70;
    //coin collected
    if (!higherThanCoin && !lowerThanCoin && !leftOfCoin && !rightOfCoin) {
      bitCoinArray.splice(this.index, 1);
      scoreboard.coinsCollected += 1;
    }
  }
}
class Ground{
  constructor(x, y, w, h, xSpeed=0, range=0, flickering=0){
    this.count = 0;
    this.originalX = x;
    this.originalY= y;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.left = x;
    this.right = x+this.width;
    this.bottom = this.y + this.height;
    this.top = this.y;
    this.xSpeed=xSpeed;
    this.range = range;
    this.flickering = flickering;
    this.on = true;
  }
  isHit(){
    character.top = character.y;
    character.bottom = character.y+character.height;
    character.left = character.x;
    character.right = character.x+character.width;
    this.left = this.x;
    this.right = this.x+this.width;
    this.bottom = this.y + this.height;
    this.top = this.y;
    let higherThanGround = character.bottom < this.top+81;
    let lowerThanGround = character.bottom > this.top+137;
    let leftOfGround = character.right < this.left+135;
    let rightOfGround = character.left > this.right-135;
    if (!higherThanGround && !lowerThanGround && !leftOfGround && !rightOfGround) {
      if(character.jumpPower >= 0){ //must land on tile when falling
        character.jumpMode = false;
        character.jumpPower = 0;
        character.y = this.top-100;
        character.onTopOfBox = true;
      }
    }
  }
  draw(){
    //change direction if surpassing range
    this.x += this.xSpeed;
    if(this.x >= this.originalX+this.range || this.x <= this.originalX){
      this.xSpeed *= -1;
    }
    if(this.count == 0 && this.flickering != 0){
      this.on = true;
      this.x = this.originalX;
      this.y = this.originalY;
    }
    if(this.count >= this.flickering && this.flickering != 0){ //turn off ground for flickering time
      this.on = false;
    }
    if(this.on){
      this.count += 1;
      image(groundImage, this.x, this.y, this.width, this.height);
    }
    else{//ground is off
      this.x = -1000;
      this.y = -1000;
      this.count -= 1;
    }
  }
}
class Character{
  constructor(x, y, height, width){
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.frame = {x: 0, y: 0};
    this.jumpMode = false;
    this.jumpPower = 0;
    this.jumpRate = 8;
    this.speed = 0;
    this.accel = 0.15;
    this.speedLimit = 10;
    this.top = this.y;
    this.bottom = this.y+this.height;
    this.left = this.x;
    this.right = this.x+this.width;
    this.onTopOfBox = false;
  }
  animate(){
    game.count += 1;
    if(game.count >= game.delay){
      //range the character y frames from 0-3 while x frame is 0
      //aka make the character march while idle or animate while running
      character.frame.x = (character.frame.x+1)%m;
      game.count = 0;
    }
  }
  move(){
    if((keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) && character.jumpMode === false ){ //jump
      character.jumpMode = true;
      character.jumpPower -= character.jumpRate;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      if(character.frame.y != 3){
        character.speed = 0;
        character.frame.y = 3;
      }
      character.speed -= character.accel;
      character.speed = constrain(character.speed, -character.speedLimit, character.speedLimit);
    }
    else if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      if(character.frame.y != 1){
        character.speed = 0;
        character.frame.y = 1;
      }
      character.speed += character.accel;
      character.speed = constrain(character.speed, -character.speedLimit, character.speedLimit);
    }
    else{ //no key is down
      character.speed = 0;
      character.frame.y = 0;
    }
  }
}

function preload(){
  spritesheet = loadImage('assets/character.png');
  groundImage = loadImage('assets/ground.png');
  bitCoinImage = loadImage('assets/bitcoin.png');
  arcadeFont = loadFont('assets/ARCADE_N.ttf');
}

function setup(){
  theCanvas = createCanvas(window.innerWidth*0.90, window.innerHeight*0.90);
  repositionCanvas();
  canvas = document.querySelector('canvas');
  //smooth out the image
  context = canvas.getContext('2d');
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  //create class instances
  game = new Game();
  scoreboard = new ScoreBoard(10, 30);
  character = new Character(0, game.ground-185, 200, 200);
  stages = new Stages();
  bitCoinArray = stages.coinStages[scoreboard.stage];
  groundArray = stages.groundStages[scoreboard.stage];
}

//get a sprite frame based on x y location in 4 x 4 matrix
function drawFrame(x, y){
  character.x += character.speed;
  if(character.x >= theCanvas.width-character.width/1.5){
    if(bitCoinArray.length > 0){//if coins left on stage dont let pass
      character.x = theCanvas.width-character.width/1.5
    }
  }
  if(character.x > theCanvas.width){
    character.x = 0;
    scoreboard.stage += 1;
    stages.loadNewStage();
  }
  else if(character.x < -character.width/4){
    character.x = -character.width/4;
  }
  //character.speed = constrain(character.speed, -character.speedLimit, character.speedLimit);
  if(character.jumpMode){
      // adjust y position of character based on jumpPower
    character.y += character.jumpPower;
    // degrade jump power slightly using gravity
    character.jumpPower += game.gravity;
    // did we go through the floor?  if so, stop jumping and put the player onto the floor

    if (character.y >= game.ground-185) {
      character.jumpMode = false;
      character.jumpPower = 0;
      character.pos = game.ground-185
    }
  }
  else{ //not jumping
    if(!character.onTopOfBox){ //and not on top of box
      character.jumpMode = true;
    }
  }
  widthOfFrame = spritesheet.width/m;
  heightOfFrame = spritesheet.height/n;
  xResult = x*widthOfFrame;
  yResult = y*heightOfFrame;
  sprite = spritesheet.get(xResult, yResult, widthOfFrame, heightOfFrame);
  image(sprite, character.x, character.y, character.width, character.height);
}

function repositionCanvas() {
  var xPos = int(windowWidth/2 - 0.5*width);
  var yPos = int(windowHeight/2 - 0.5*height);
  theCanvas.position(xPos, yPos);
  theCanvas.width = windowWidth*0.9;
  theCanvas.height = windowHeight*0.9;
}
// this function runs every time the window is resized
function windowResized() {
  repositionCanvas();
}

function drawGrounds(){
  character.onTopOfBox = false;
  for(var i = 0; i < groundArray.length; i++){
    let currentGround = groundArray[i];
    currentGround.draw()
    currentGround.isHit();
  }
}

function drawCoins(){
  for(var i = 0; i < bitCoinArray.length; i++){
    currentCoin = bitCoinArray[i];
    currentCoin.draw();
    currentCoin.isHit();
  }
}
function draw(){
  background(game.skyColor);
  scoreboard.draw();
  //draw ground
  fill(game.grassColor);
  noStroke()
  rect(0, game.ground, theCanvas.width, theCanvas.height);
  character.move();
  character.animate();
  drawGrounds();
  drawCoins();
  drawFrame(character.frame.x, character.frame.y);
}
