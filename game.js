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
    this.grassColor = "#7EC850"
    this.skyColor = "#D1EEFE"
  }
}
class Character{
  constructor(x, y, height, width){
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.frame = {x: 0, y: 0};
  }
  animate(){
    game.count += 1;
    if(game.count === game.delay){
      if(character.frame.y === 0){
        //range the character y frames from 0-3 while x frame is 0
        //aka make the character march while idle
        character.frame.x = (character.frame.x+1)%m;
      }
      game.count = 0;
    }
  }
  move(){
    if ((keyIsDown(LEFT_ARROW)){

    }
    if ((keyIsDown(RIGHT_ARROW)){
      
    }
  }
}

function preload(){
  spritesheet = loadImage('assets/character.png');
}

function setup(){
  theCanvas = createCanvas(window.innerWidth*0.90, window.innerHeight*0.90);
  repositionCanvas();
  canvas = document.querySelector('canvas');
  console.log(spritesheet.width, spritesheet.height)
  //smooth out the image
  context = canvas.getContext('2d');
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  //create class instances
  game = new Game();
  character = new Character(0, game.ground-185, 200, 200);
}

function draw(){
  background(game.skyColor);
  //draw ground
  fill(game.grassColor);
  noStroke()
  rect(0, game.ground, theCanvas.width, theCanvas.height);

  character.animate();
  character.move();


  drawFrame(character.frame.x, character.frame.y);
}
//get a sprite frame based on x y location in 4 x 4 matrix
function drawFrame(x, y){
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
  console.log(theCanvas.width)
  theCanvas.width = windowWidth*0.9;
  theCanvas.height = windowHeight*0.9;
}
// this function runs every time the window is resized
function windowResized() {
  repositionCanvas();
}
