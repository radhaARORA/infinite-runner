//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trexImg1,trexImg2,trexImg3,trexCollided;
var cloudImg,groundImg,replayImg;
var obImg1,obImg2,obImg3,obImg4,obImg5,obImg6;

function preload(){
trexImg1=loadAnimation("images/trex1.png");
trexImg2=loadAnimation("images/trex2.png");
trexImg3=loadAnimation("images/trex3.png");
trexCollided=loadImage("images/trex_collided.png");
cloudImg=loadImage("images/cloud1.png");
obImg1=loadAnimation("images/obstacle1.png");
obImg2=loadAnimation("images/obstacle2.png");
obImg3=loadAnimation("images/obstacle3.png");
obImg4=loadAnimation("images/obstacle4.png");
obImg5=loadAnimation("images/obstacle5.png");
obImg6=loadAnimation("images/obstacle6.png");
replayImg=loadImage("images/replay.png");
}
function setup(){
//adjusting canvas to size of device
  canvas = createCanvas(displayWidth - 20, displayHeight-30);

//create a trex sprite
 trex = createSprite(200,380,20,50);
trex.addAnimation("trex");

//set collision radius for the trex
trex.setCollider("circle",0,0,30);

//scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//create a ground sprite
var ground = createSprite(200,380,400,20);
ground.setAnimation("ground2");
ground.x = ground.width /2;

//invisible Ground to support Trex
var invisibleGround = createSprite(200,385,400,5);
invisibleGround.visible = false;

//create Obstacle and Cloud Groups
var ObstaclesGroup = createGroup();
var CloudsGroup = createGroup();

//place gameOver and restart icon on the screen
var gameOver = createSprite(200,300);
var restart = createSprite(200,340);
gameOver.addImage("gameOver");
gameOver.scale = 0.5;
restart.addImage("restartImg");
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);

//score
var count = 0;

camera.position.x=displayWidth/2;
camera.position.y=displayHeight/2;
}
function draw() {
  //set background to white
  background("white");
  //display score
  text("Score: "+ count, 250, 100);
  console.log(gameState);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count+Math.round(World.frameRate/60);
    
    if (count>0 && count%100 === 0){
      playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 359){
      trex.velocityY = -12 ;
      playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      playSound("jump.mp3");
      gameState = END;
      playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.addImage("trexCollided");
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
 restart.visible=false; 
 gameOver.visible=false;
 
CloudsGroup.destroyEach();
ObstaclesGroup.destroyEach();
  trex.addAnimation("trex");
count=0;
  
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(400,365,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = randomNumber(1,6);
    obstacle.addAnimation("obstacle" + rand);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(400,320,40,10);
    cloud.y = randomNumber(280,320);
    cloud.addImage("cloudImg");
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
