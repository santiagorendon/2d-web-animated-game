let canvas;
let theCanvas;
let character;
let context;
//n * m sprite
let n = 4;
let m = 4;

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

class Ground{
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.left = x;
    this.right = x+this.width;
    this.bottom = this.y + this.height;
    this.top = this.y;
  }
  draw(){
    image(groundImage, this.x, this.y, this.width, this.height);
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
    this.accel = 0.1;
    this.speedLimit = 8;
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
  character = new Character(0, game.ground-185, 200, 200);
  groundArray = [
    new Ground(0, game.ground-200, 200, 200)
  ];
}

//get a sprite frame based on x y location in 4 x 4 matrix
function drawFrame(x, y){
  character.x += character.speed;
  if(character.x > theCanvas.width){
    character.x = 0;
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
    console.log(character.onTopOfBox)
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
    character.top = character.y;
    character.bottom = character.y+character.height;
    character.left = character.x;
    character.right = character.x+character.width;
    let higherThanGround = character.bottom < currentGround.top+81;
    let lowerThanGround = character.bottom > currentGround.top+137;
    let leftOfGround = character.right < currentGround.left+135;
    let rightOfGround = character.left > currentGround.right-135;
    if (!higherThanGround && !lowerThanGround && !leftOfGround && !rightOfGround) {
      if(character.jumpPower >= 0){ //must land on tile when falling
        character.jumpMode = false;
        character.jumpPower = 0;
        character.y = currentGround.top-100;
        character.onTopOfBox = true;
      }
    }
  }
}
function draw(){
  background(game.skyColor);
  //draw ground
  fill(game.grassColor);
  noStroke()
  rect(0, game.ground, theCanvas.width, theCanvas.height);
  character.move();
  character.animate();
  drawGrounds();
  drawFrame(character.frame.x, character.frame.y);
}
