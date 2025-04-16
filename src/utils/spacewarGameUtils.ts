
// Utility functions for the Spacewar game

export const checkCollision = (
  x1: number, 
  y1: number, 
  size1: number, 
  x2: number, 
  y2: number, 
  size2: number
): boolean => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance < (size1 + size2);
};

export const generateStars = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: Math.random() * 1.5 + 0.5,
  }));
};

export const generateAsteroids = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * (canvasHeight / 2) + 100,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
  }));
};

export const updateAsteroids = (
  asteroids: {x: number, y: number, dx: number, dy: number}[], 
  canvasWidth: number, 
  canvasHeight: number, 
  asteroidSize: number
) => {
  asteroids.forEach(asteroid => {
    asteroid.x += asteroid.dx;
    asteroid.y += asteroid.dy;
    
    if (asteroid.x > canvasWidth - asteroidSize || asteroid.x < asteroidSize) {
      asteroid.dx *= -1;
    }
    if (asteroid.y > canvasHeight - asteroidSize || asteroid.y < asteroidSize) {
      asteroid.dy *= -1;
    }
  });
};

// Initialize game state
export const initializeGame = (canvasWidth: number, canvasHeight: number, difficulty: number) => {
  // Ship and bullet settings
  const shipSize = 10;
  const bulletSize = 3;
  const playerSpeed = 5;
  const enemySpeed = 3 + difficulty * 0.5;
  const bulletSpeed = 7;

  // Calculate initial positions
  const playerX = canvasWidth / 2;
  const playerY = canvasHeight - 50;
  const enemyX = canvasWidth / 2;
  const enemyY = 50;

  // Generate stars and asteroids
  const stars = generateStars(100, canvasWidth, canvasHeight);
  const asteroidCount = Math.min(5 + difficulty, 12);
  const asteroids = generateAsteroids(asteroidCount, canvasWidth, canvasHeight);
  const asteroidSize = 15;

  // Create game state object
  return {
    // Canvas dimensions
    canvasWidth,
    canvasHeight,
    
    // Game objects
    player: {
      x: playerX,
      y: playerY,
      movingLeft: false,
      movingRight: false,
      speed: playerSpeed,
      shootCooldown: 0,
    },
    enemy: {
      x: enemyX,
      y: enemyY,
      speed: enemySpeed,
      direction: 1,
      shootCooldown: 0,
    },
    playerBullets: Array(10).fill(0).map(() => ({ x: 0, y: 0, active: false })),
    enemyBullets: Array(10).fill(0).map(() => ({ x: 0, y: 0, active: false })),
    
    // Environment
    stars,
    asteroids,
    
    // Game settings
    shipSize,
    bulletSize,
    bulletSpeed,
    asteroidSize,
    
    // Game state
    userScore: 0,
    computerScore: 0,
    scoreChanged: false,
    
    // Timing
    lastEnemyMoveTime: 0,
    enemyMoveDelay: 500 / (difficulty + 1),
    lastEnemyShootTime: 0,
    enemyShootDelay: 1500 / (difficulty + 0.5),
  };
};

// Update game state based on elapsed time
export const updateGameState = (gameState: any, deltaTime: number, difficulty: number) => {
  // Update player position based on input
  if (gameState.player.movingLeft && gameState.player.x > gameState.shipSize) {
    gameState.player.x -= gameState.player.speed;
  }
  if (gameState.player.movingRight && gameState.player.x < gameState.canvasWidth - gameState.shipSize) {
    gameState.player.x += gameState.player.speed;
  }
  
  // Update player shoot cooldown
  if (gameState.player.shootCooldown > 0) {
    gameState.player.shootCooldown -= deltaTime;
  }
  
  // Automatically fire player bullets when cooldown is ready
  if (gameState.player.shootCooldown <= 0) {
    // Find an inactive bullet to use
    const inactiveBullet = gameState.playerBullets.find(bullet => !bullet.active);
    if (inactiveBullet) {
      inactiveBullet.x = gameState.player.x;
      inactiveBullet.y = gameState.player.y - gameState.shipSize;
      inactiveBullet.active = true;
      gameState.player.shootCooldown = 0.5; // 0.5 seconds between shots
    }
  }
  
  // Update enemy AI
  // Move enemy ship back and forth
  gameState.enemy.x += gameState.enemy.speed * gameState.enemy.direction * deltaTime;
  if (gameState.enemy.x > gameState.canvasWidth - gameState.shipSize || gameState.enemy.x < gameState.shipSize) {
    gameState.enemy.direction *= -1;
  }
  
  // Enemy shooting
  gameState.enemy.shootCooldown -= deltaTime;
  if (gameState.enemy.shootCooldown <= 0) {
    // Find an inactive bullet to use
    const inactiveBullet = gameState.enemyBullets.find(bullet => !bullet.active);
    if (inactiveBullet) {
      inactiveBullet.x = gameState.enemy.x;
      inactiveBullet.y = gameState.enemy.y + gameState.shipSize;
      inactiveBullet.active = true;
      gameState.enemy.shootCooldown = 1.0 - (difficulty * 0.1); // Faster shooting at higher difficulties
    }
  }
  
  // Update bullets
  gameState.playerBullets.forEach(bullet => {
    if (bullet.active) {
      bullet.y -= gameState.bulletSpeed;
      
      // Check for collision with enemy
      if (checkCollision(
        bullet.x, bullet.y, gameState.bulletSize,
        gameState.enemy.x, gameState.enemy.y, gameState.shipSize
      )) {
        bullet.active = false;
        gameState.userScore++;
        gameState.scoreChanged = true;
      }
      
      // Check if bullet is off screen
      if (bullet.y < 0) {
        bullet.active = false;
      }
    }
  });
  
  gameState.enemyBullets.forEach(bullet => {
    if (bullet.active) {
      bullet.y += gameState.bulletSpeed;
      
      // Check for collision with player
      if (checkCollision(
        bullet.x, bullet.y, gameState.bulletSize,
        gameState.player.x, gameState.player.y, gameState.shipSize
      )) {
        bullet.active = false;
        gameState.computerScore++;
        gameState.scoreChanged = true;
      }
      
      // Check if bullet is off screen
      if (bullet.y > gameState.canvasHeight) {
        bullet.active = false;
      }
    }
  });
  
  // Update asteroids
  updateAsteroids(gameState.asteroids, gameState.canvasWidth, gameState.canvasHeight, gameState.asteroidSize);
};
