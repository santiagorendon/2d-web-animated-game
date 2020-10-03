//easy - lower gravity
//normal - no modifications
//hard - ground speeds and flickers are faster
let pxScale = window.devicePixelRatio;
let canvas;
let theCanvas;
let character;
let context;
let bitCoinArray;
let stages;
let groundArray;
//n * m sprite
let n = 4;
let m = 4;
let submitBtn;
let binArray;
let bin;
//for debugging
function mouseClicked(){
  if(game.started){
    if(game.cheatsEnabled){ //teleport ability
      character.x = mouseX-100;
      if(mouseY <= game.ground){
        character.y = mouseY-180;
      }
    }
  }
  else{ //main menu selection
    if(game.currentHover == "easy"){
      menuSelectionSound.play();
      menuLoopMusic.stop();
      game.startGame("easy")
    }
    else if(game.currentHover == "normal"){
      menuSelectionSound.play();
      menuLoopMusic.stop();
      game.startGame("normal");
    }
    else if(game.currentHover == "hard"){
      menuSelectionSound.play();
      menuLoopMusic.stop();
      game.startGame("hard");
    }
    else if(game.hoveringOverMainMenu){
      menuSelectionSound.play();
      gameWonLoopMusic.stop();
      game.ended = false;
    }
  }
}
//i put in hard coded pixel values in the beginning
//this will turn them into the correct proportion of the canvas width
function fX(x){
  let myCanvasWidth = 1728;
  return ((x/myCanvasWidth)*theCanvas.width);
}
//i put in hard coded pixel values in the beginning
//this will turn them into the correct proportion of the canvas height
function fY(y){
  let myCanvasHeight = 984.6;
  return ((y/myCanvasHeight)*theCanvas.height);
}
class Stages{
  constructor(){
    this.stage1Grounds = [
      new Ground(fX(200), game.ground-fY(200), fX(200), fY(200)),
      new Ground(fX(720), game.ground-fY(350), fX(200), fY(200), fX(1), fX(200)),
      new Ground(fX(200), game.ground-fY(500), fX(200), fY(200))
    ]
    this.stage1Coins = [
      new BitCoin(fX(265), fY(320), 0) //x, y, index
    ]
    this.stage2Grounds = [
      new Ground(fX(400), game.ground-fY(275), fX(200), fY(200)),
      new Ground(fX(700), game.ground-fY(475), fX(200), fY(200), 0, 0, 0, 0, 30),
      new Ground(fX(960), game.ground-fY(800), fX(200), fY(200), fX(1), fX(200), fY(1), fY(200)),
      new Ground(fX(1450), game.ground-fY(805), fX(200), fY(200)),
      new Ground(fX(400), game.ground-fY(805), fX(200), fY(200))
    ]
    this.stage2Coins = [
      new BitCoin(fX(465), 10, 0),
      new BitCoin(fX(1515), 50, 1)
    ]
    this.stage3Grounds = [
      new Ground(fX(400), game.ground-fY(275), fX(200), fY(200)),
      new Ground(fX(1200), game.ground-fY(355), fX(200), fY(200)),
      new Ground(fX(480), game.ground-fY(485), fX(200), fY(200)),
      new Ground(fX(1280), game.ground-fY(565), fX(200), fY(200)),
      new Ground(fX(560), game.ground-fY(695), fX(200), fY(200)),
      new Ground(fX(1360), game.ground-fY(775), fX(200), fY(200))
    ]
    this.stage3Coins = [
      new BitCoin(1420, 50, 0)
    ]
    this.stage4Grounds = [
      new Ground(fX(1100), game.ground-fY(275), fX(200), fX(200)),
      new Ground(fX(700), game.ground-fY(475), fX(200), fX(200)),
      new Ground(fX(1550), game.ground-fY(630), fX(200), fX(200), 0, 0, fY(1), fY(150)),
      new Ground(fX(1100), game.ground-fY(805), fX(200), fX(200)),
      new Ground(fX(500), game.ground-fY(805), fX(200), fX(200), fY(4), fY(300))
    ]
    this.stage4Coins = [
      new BitCoin(fX(200), fY(90), 0),
      new BitCoin(fX(1400), fY(500), 1)
    ]
    this.stage5Coins = [
      new BitCoin(fX(250), fY(320), 0),
      new BitCoin(fX(80), fY(100), 1),
      new BitCoin(fX(1000), fY(500), 2)
    ]
    this.stage5Grounds = [
      new Ground(fX(250), game.ground-fY(200), fX(200), fY(200), 0, 0, 0, 0, 50),
      new Ground(fX(760), game.ground-fY(401), fX(200), fY(200)),
      new Ground(fX(1200), game.ground-fY(601), fX(200), fY(200), 0, 0, 0, 0, 160),
      new Ground(fX(760), game.ground-fY(801), fX(200), fY(200))
    ]
    this.groundStages = [this.stage1Grounds,
                         this.stage2Grounds,
                         this.stage3Grounds,
                         this.stage4Grounds,
                         this.stage5Grounds
    ];
    this.coinStages = [this.stage1Coins,
                       this.stage2Coins,
                       this.stage3Coins,
                       this.stage4Coins,
                       this.stage5Coins
    ];
  }
  loadNewStage(){
    if(scoreboard.stage-1 < this.groundStages.length){
      bitCoinArray = this.coinStages[scoreboard.stage-1];
      groundArray = this.groundStages[scoreboard.stage-1];
    }
    else{
      this.loadGameWon();
    }
  }
  loadGameWon(){
    game.musicCount = 0; //reset music counter
    gameLoopMusic.stop(); //stop game music
    gameWonLoopMusic.loop(); //load game won music
    game.currentHover = "none";
    character.x = -1000;
    character.y = -1000;
    game.ended = true;
    game.started = false;
    clear();
    canvas.style.display = "block"

    bin = ["0", "1"];
    let cols = theCanvas.width/22;
    binArray = [];

    for(let i=0; i < cols; i++){
      binArray[i] = 1;
    }
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
    textAlign(LEFT, TOP)
  .strokeWeight(0)
   .textSize(20);
    textFont(arcadeFont);
    text(`BitCoin ${this.coinsCollected}\nStage ${this.stage}`, this.x, this.y);
  }
}
class Game{
  constructor(mode="normal"){
    this.cheatsEnabled = false;
    this.flicker =15;
    this.started = false;
    this.ended = false;
    this.mode = mode;
    this.count = 0;
    this.countDirection = 1;
    this.delay = 15;
    this.ground = theCanvas.height*0.90;
    this.grassColor = "#7EC850";
    this.skyColor = "#D1EEFE";
    this.color = '#000';
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = 0;
    this.currentHover = "none";
    this.fontEasy = 30;
    this.colorEasy = "#000";
    this.fontNormal = 30;
    this.colorNormal = "#000";
    this.fontHard = 30;
    this.colorHard = "#000";
    this.hoveringOverMainMenu = false;
    // main menu text in game won screen
    this.mainMenuSize = 30;
    this.mainMenuColor = "green";
    this.flashCounter = 0;
    this.flashDelay = 3;
    this.musicCount = 0;
    this.musicDelay = 50;
  }
  drawMenu(){
    this.drawMenuText();
    character.width = fX(400);
    character.height = fY(400);
    character.x = fX(650);
    character.y = fY(300);
    character.frame.y = 0;
    this.gravity = 0;
    character.drawFrame();
    character.animate();
  }
  startGame(mode){
    game.mode = mode;
    this.started = true;
    this.count = 0;
    this.flicker = 0;
    character.width = fX(200);
    character.height = fY(200);
    character.x = 0;
    character.y = game.ground-fY(185);
    if(mode == "easy"){
      this.gravity = 0.15;
    }
    else{
      this.gravity = 0.2;
    }
    stages = new Stages();
    scoreboard.stage = 1;
    scoreboard.coinsCollected = 0;
    bitCoinArray = stages.coinStages[scoreboard.stage-1];
    groundArray = stages.groundStages[scoreboard.stage-1];
    console.log(bitCoinArray);
  }
  drawMenuText(){
    this.count += this.countDirection;
    if(this.count >= this.flicker || this.count < 0){
      this.countDirection = -this.countDirection;
      this.r = random(0, 255);
      this.g = random(0, 255);
      this.b = 0;
    }
    fill(this.r, this.g, this.b)
    .strokeWeight(0)
     .textSize(fY(80));
    textFont(arcadeFont);
    textAlign(CENTER, TOP);
    text("BitFarmer", theCanvas.width/2, theCanvas.height/4);
    textSize(fY(30));
    if(this.currentHover == "none"){ //not hovering over anything
      this.fontEasy = 30;
      this.colorEasy = "#000";
      this.fontNormal = 30;
      this.colorNormal = "#000";
      this.fontHard = 30;
      this.colorHard = "#000";
    }
    fill(this.colorEasy)
    textSize(fY(this.fontEasy));
    text("easy", theCanvas.width*0.38, theCanvas.height/1.3, fY(30));
    fill(this.colorNormal);
    textSize(fY(this.fontNormal));
    text("normal", theCanvas.width*0.5, theCanvas.height/1.3, fY(30));
    fill(this.colorHard);
    textSize(fY(this.fontHard));
    text("hard", theCanvas.width*0.62, theCanvas.height/1.3, fY(30));

    let r1 = this.isHit(theCanvas.width*0.38, theCanvas.height/1.3, fX(60), fY(28), 0);
    let r2 =this.isHit(theCanvas.width*0.5, theCanvas.height/1.3, fX(85), fY(28), 1);
    let r3 = this.isHit(theCanvas.width*0.62, theCanvas.height/1.3, fX(56), fY(28), 2);
    if(r1+r2+r3 ===0){
      this.currentHover="none";
    }
    //txt2.isHit();
    //txt3.isHit();

  }
  isHit(x, y, w, h, index){
    let textTop = y;
    let textBottom = y+h;
    let textLeft = x-w;
    let textRight = x+w;

    let higherThanText = textTop > mouseY;
    let lowerThanText = textBottom < mouseY;

    let leftOfText = mouseX < textLeft;
    let rightOfText = mouseX > textRight;
    if (!higherThanText && !lowerThanText && !leftOfText && !rightOfText) {
      if(index == 0){
        this.colorEasy = "#ff69b4";
        this.fontEasy = 40;
        this.currentHover = "easy"
      }
      else if(index == 1){
        this.currentHover = "normal";
        this.fontNormal = 40;
        this.colorNormal = "#00FF00";
      }
      else if(index == 2){
        this.currentHover = "hard"
        this.fontHard = 40;
        this.colorHard = "#f00";
      }
      return 1;
    }
    return 0;
  }
  drawGameEndMenu(){
    fill('rgba(0, 0, 0, 0.05)');
    rect(0,0, theCanvas.width, theCanvas.height);
    //context.font = "22px arial";
    textFont('arial')
    fill("green").textSize(22);
    this.flashCounter += 1;

    if(this.flashCounter >= this.flashDelay){
      for(let i=0; i < binArray.length; i++){
        let textContent = bin[Math.floor(Math.random()*bin.length)];
        text(textContent, i * 22, binArray[i] * 22);
        if(binArray[i] * 22 >  theCanvas.height && Math.random() > 0.98){
          binArray[i] = 0;
        }
        binArray[i] += 1;
      }
      this.flashCounter = 0;
    }

    textFont(arcadeFont);
    fill("red")
    textSize(fY(80))
    textAlign(CENTER, CENTER)
    text('YOU WON!', theCanvas.width/2, theCanvas.height/2);
    textSize(fY(this.mainMenuSize))
    fill(this.mainMenuColor)
    text("MAIN MENU", theCanvas.width*0.475, theCanvas.height*0.65);
    this.mainMenuIsHit(theCanvas.width*0.475, theCanvas.height*0.65, fX(129), fY(28));
  }
  mainMenuIsHit(x, y, w, h){
    let textTop = y;
    let textBottom = y+h;
    let textLeft = x-w;
    let textRight = x+w;
    let higherThanText = textTop > mouseY;
    let lowerThanText = textBottom < mouseY;
    let leftOfText = mouseX < textLeft;
    let rightOfText = mouseX > textRight;
    //hovering over main menu
    if (!higherThanText && !lowerThanText && !leftOfText && !rightOfText) {
      this.mainMenuSize = 40;
      this.mainMenuColor = "red"
      this.hoveringOverMainMenu = true;
    }
    else{//not hovering
      this.mainMenuSize = 30;
      this.mainMenuColor = "green";
      this.hoveringOverMainMenu = false;
    }
  }
}


class BitCoin{
  constructor(x, y, i){
    this.index = i;
    this.x = x;
    this.y = y;
    this.width = fX(70);
    this.height = fY(70);
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
    let higherThanCoin= character.bottom < this.top+fY(20);
    let lowerThanCoin = character.top > this.top-fY(20);
    let leftOfCoin = character.right < this.left+fX(70);
    let rightOfCoin = character.left > this.right-fX(70);
    //coin collected
    if (!higherThanCoin && !lowerThanCoin && !leftOfCoin && !rightOfCoin) {

      coinSound.play();
      bitCoinArray.splice(this.index, 1);
      for(var i = 0; i < bitCoinArray.length;i++){ //re-index
        bitCoinArray[i].index = i;
      }
      scoreboard.coinsCollected += 1;
    }
  }
}
class Ground{
  constructor(x, y, w, h, xSpeed=0, xRange=0, ySpeed=0, yRange=0, flickering=0){
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
    if(game.mode == "hard"){
      this.xSpeed=2*xSpeed;
      this.ySpeed=2*ySpeed;
      this.flickering = flickering/2;
    }
    else{
      this.xSpeed=xSpeed;
      this.ySpeed=ySpeed;
      this.flickering = flickering;
    }
    this.xRange = xRange;
    this.yRange = yRange;
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
    let higherThanGround = character.bottom < this.top+fY(81);
    let lowerThanGround = character.bottom > this.top+fY(137);
    let leftOfGround = character.right < this.left+fX(135);
    let rightOfGround = character.left > this.right-fX(135);
    if (!higherThanGround && !lowerThanGround && !leftOfGround && !rightOfGround) {
      if(character.jumpPower >= 0){ //must land on tile when falling
        character.jumpMode = false;
        character.jumpPower = 0;
        character.y = this.top-fY(100);
        character.onTopOfBox = true;
      }
    }
  }
  draw(){
    //change direction if surpassing range
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if(this.x >= this.originalX+this.xRange || this.x <= this.originalX){
      this.xSpeed *= -1;
    }
    if(this.y >= this.originalY+this.yRange || this.y <= this.originalY){
      this.ySpeed *= -1;
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
      jumpSound.play()
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
  //get a sprite frame based on x y location in 4 x 4 matrix
  drawFrame(){
    this.x += this.speed;
    if(this.x >= theCanvas.width-this.width/1.5){
      if(bitCoinArray.length > 0){//if coins left on stage dont let pass
        this.x = theCanvas.width-this.width/1.5
      }
    }
    if(this.x > theCanvas.width){
      scoreboard.stage += 1;
      stages.loadNewStage();
      this.x = 0;
      this.y = game.ground-fY(185)
    }
    else if(this.x < -this.width/4){
      this.x = -this.width/4;
    }
    //character.speed = constrain(character.speed, -character.speedLimit, character.speedLimit);
    if(this.jumpMode){
        // adjust y position of character based on jumpPower
      this.y += this.jumpPower;
      // degrade jump power slightly using gravity
      this.jumpPower += game.gravity;
      // did we go through the floor?  if so, stop jumping and put the player onto the floor

      if (this.y >= game.ground-fY(185)) {
        this.jumpMode = false;
        this.jumpPower = 0;
        this.y = game.ground-fY(185);
      }
    }
    else{ //not jumping
      if(!this.onTopOfBox){ //and not on top of box
        this.jumpMode = true;
      }
    }
    let widthOfFrame = spritesheet.width/m;
    let heightOfFrame = spritesheet.height/n;
    let xResult = this.frame.x*widthOfFrame;
    let yResult = this.frame.y*heightOfFrame;
    let sprite = spritesheet.get(xResult, yResult, widthOfFrame, heightOfFrame);
    image(sprite, this.x, this.y, this.width, this.height)
  }
}

function preload(){
  spritesheet = loadImage('assets/character.png');
  groundImage = loadImage('assets/ground.png');
  bitCoinImage = loadImage('assets/bitcoin.png');
  arcadeFont = loadFont('assets/ARCADE_N.TTF');
  floorImage = loadImage('assets/floor.png');
  coinSound = loadSound('assets/coin.wav');
  coinSound.setVolume(0.4);
  jumpSound = loadSound('assets/jump.wav');
  menuSelectionSound = loadSound('assets/menuSelection.wav');
  menuLoopMusic = loadSound('assets/menuLoop.mp3');
  gameLoopMusic = loadSound('assets/gameLoop.wav');
  gameLoopMusic.setVolume(0.2);
  gameWonLoopMusic = loadSound('assets/gameWonLoop.wav');
  gameWonLoopMusic.setVolume(0.6);
}

function setup(){
  theCanvas = createCanvas(0.9*windowWidth, 0.9*windowHeight);
  //theCanvas = createCanvas(1728*pxScale, 984.6*pxScale);
  repositionCanvas();
  canvas = document.querySelector('canvas');
  //smooth out the image
  context = canvas.getContext('2d');
  //context.scale(pxScale, pxScale);
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  //create class instances
  game = new Game("normal");
  scoreboard = new ScoreBoard(fX(10), fY(30));
  character = new Character(0, game.ground-fY(185), fX(200), fY(200));
  //mainMenuCharacter = new Character(0, game.ground-fY(185), fX(200), fY(200));
  // bitCoinArray = stages.coinStages[2];
  // groundArray = stages.groundStages[2];
  let submitBtn = document.querySelector('#submit');
  submitBtn.addEventListener('click', cheatsSubmitted);
}

function cheatsSubmitted(){
  let cheatcodes = document.querySelector('#code');
  if(cheatcodes.value == 'TELEPORT'){
    game.cheatsEnabled = true;
    alert('click anywhere in game to teleport to that spot');
    cheatcodes.placeholder = "ENTER CODE";
  }
  else{
    cheatcodes.placeholder = "WRONG CODE";
  }
  cheatcodes.value = "";
}

function repositionCanvas() {
  var xPos = int(windowWidth/2 - 0.5*width);
  var yPos = int(windowHeight/2 - 0.5*height);
  theCanvas.position(xPos, yPos);
  theCanvas.width = fX(1728);
  theCanvas.height = fY(984.6);
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
  if(game.started){
    game.musicCount += 1;
    console.log(game.musicCount, game.musicDelay)
    if(game.musicCount >= game.musicDelay){
      if(!gameLoopMusic.isPlaying()){
        gameLoopMusic.loop();
      }
    }
    background(game.skyColor);
    scoreboard.draw();
    //draw ground
    fill(game.grassColor);
    noStroke()
    //rect(0, game.ground, theCanvas.width, theCanvas.height);
    // console.log(theCanvas.height-game.ground)
    image(floorImage, 0, fY(820), theCanvas.width, theCanvas.height-game.ground+fY(100))
    character.move();
    character.animate();
    drawGrounds();
    drawCoins();
    character.drawFrame();
  }
  else if(game.ended){
    game.drawGameEndMenu();
  }
  else{//main menu
    if(!menuLoopMusic.isPlaying()){
      menuLoopMusic.loop();
    }
    background(game.skyColor);
    game.drawMenu();
  }
}
