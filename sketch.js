var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trexImage;
var invisibleGround;

var ground, edges;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImage;
var score=0;

var gameOver, gameOverImage, restart, restartImage;

localStorage["HighestScore"] = 0;

function preload(){
  
  backgroundImage = loadImage("background.jpg");
  
  trexImage = loadImage("trex.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  background = createSprite(width/2,height/2,width,2);
  background.addImage("ground",backgroundImage);
  background.x = width/2;
  background.scale = 4;
  
  trex = createSprite(80,height-70,20,50);
  trex.addImage("running", trexImage);
  trex.setCollider('circle',0,0,600);
  trex.scale = 0.15;
  //trex.debug = true;

  ground = createSprite(width/2,height,width,50);
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.25;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale = 0.3;
  restart.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
  
  edges = createEdgeSprites();
}

function draw() {

  camera.x = trex.x;

  gameOver.position.x = restart.position.x = camera.x;
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8;
  
    if (background.x < 0){
      background.x = background.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true; 
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
        reset();
    }
    
  }
  
  trex.bounceOff(edges);
  
 drawSprites();
  
  textSize(40);
  fill("black");
  text("Score: "+ score,30,100);
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-110,20,30);
    obstacle.setCollider('circle',0,0,45);
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
        
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    
    obstaclesGroup.add(obstacle);
  }
   
}

function reset(){
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();

  if(localStorage["HighScore"]<score){
     localStorage["HighScore"] = score;   
  }

  console.log(localStorage["HighScore"]);
  
  score = 0;
  
}