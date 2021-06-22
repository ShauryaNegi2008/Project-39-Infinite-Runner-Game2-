var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart;


function preload() {
  trex_running = loadAnimation("assets/trex1.png", "assets/trex3.png", "assets/trex4.png");
  trex_collided = loadAnimation("assets/trex_collided.png");

  groundImage = loadImage("assets/ground2.png");

  cloudImage = loadImage("assets/cloud.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  obstacle5 = loadImage("assets/obstacle5.png");
  obstacle6 = loadImage("assets/obstacle6.png");

  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");

  jumpSound = loadSound("mp3 folder/jump.mp3");
  dieSound = loadSound("mp3 folder/die.mp3");
  checkPointSound = loadSound("mp3 folder/checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX = (6 + 3 * score / 100);

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  

  gameOver = createSprite(trex.x + 500, 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(trex.x + 500, 100);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;


  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;
  invisibleGround.velocityX = 6 + 3 * score / 100

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(255);
  text("Score: " + score, trex.x + 225, 10);
  fill("red");
  text("Hint:Press Space To Jump",trex.x,10);
  fill("grey");
  text("Avoid Cactus",trex.x-250,10)
  camera.position.x = trex.x
  gameOver.x=trex.x;
  restart.x=trex.x;
  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);


    if (keyDown("space") && trex.y >= 159) {
      jumpSound.play();
      trex.velocityY = -12.8;
    }

    trex.velocityY = trex.velocityY + 0.8

gameOver.visible=false;
restart.visible=false;

    trex.collide(invisibleGround);
    if (frameCount % 67 === 0) ground.x = invisibleGround.x + -340;
    spawnClouds();
    spawnObstacles();

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    if (obstaclesGroup.isTouching(trex)) {
      dieSound.play();
      gameState = END;

    }
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;



    
    invisibleGround.velocityX = 0;
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;

    
    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }

  }


  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x+500, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

  
    cloud.lifetime = 200;


    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;


    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x+600, 165, 10, 40);

    
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  ground.x = 200;
  trex.x = 50;
  trex.y = 180;
  invisibleGround.x = 200;
  trex.velocityX = 6+3*score/100
  // ground.velocityX=-(7*score/100)
  invisibleGround.velocityX=6+3*score/100
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;

}
