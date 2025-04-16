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

export const initializeGame = (canvasWidth: number, canvasHeight: number, difficulty: number = 1) => {
  // Create initial game state
  const shipSize = 10;
  const bulletSize = 2;
  const asteroidSize = 10;
  const asteroidCount = Math.floor(5 * difficulty);
  
  // Generate stars for background
  const stars = generateStars(100, canvasWidth, canvasHeight);
  
  // Generate asteroids
  const asteroids = generateAsteroids(asteroidCount, canvasWidth, canvasHeight);
  
  // Create player
  const player = {
    x: canvasWidth / 4,
    y: canvasHeight / 2,
    dx: 0,
    dy: 0,
    rotation: 0,
    movingLeft: false,
    movingRight: false
  };
  
  // Create enemy
  const enemy = {
    x: (canvasWidth / 4) * 3,
    y: canvasHeight / 2,
    dx: 0,
    dy: 0
  };
  
  // Create bullets
  const playerBullets = Array(20).fill(null).map(() => ({ x: 0, y: 0, active: false }));
  const enemyBullets = Array(20).fill(null).map(() => ({ x: 0, y: 0, active: false }));
  
  // Set initial scores
  const userScore = 0;
  const computerScore = 0;
  
  return {
    stars,
    asteroids,
    player,
    enemy,
    playerBullets,
    enemyBullets,
    userScore,
    computerScore,
    shipSize,
    bulletSize,
    asteroidSize,
    scoreChanged: false,
    lastPlayerShot: 0,
    lastEnemyShot: 0
  };
};

export const updateGameState = (gameState: any, deltaTime: number, difficulty: number = 1) => {
  // Update player position based on controls
  if (gameState.player.movingLeft) {
    gameState.player.x -= 200 * deltaTime;
  }
  if (gameState.player.movingRight) {
    gameState.player.x += 200 * deltaTime;
  }
  
  // Keep player in bounds
  const playerBoundary = gameState.shipSize;
  
  // Ensure player doesn't go below the left boundary
  if (gameState.player.x < playerBoundary) {
    gameState.player.x = playerBoundary;
  }
  
  // Ensure player doesn't go beyond the right boundary
  if (gameState.player.x > (gameState.canvasWidth || 600) - playerBoundary) {
    gameState.player.x = (gameState.canvasWidth || 600) - playerBoundary;
  }
  
  // Basic enemy AI - follow player with some randomization
  const enemySpeed = 100 * difficulty * deltaTime;
  if (gameState.enemy.x < gameState.player.x) {
    gameState.enemy.x += enemySpeed * (0.7 + Math.random() * 0.3);
  } else {
    gameState.enemy.x -= enemySpeed * (0.7 + Math.random() * 0.3);
  }
  
  // Update asteroids
  updateAsteroids(
    gameState.asteroids, 
    gameState.canvasWidth || 600, 
    gameState.canvasHeight || 400, 
    gameState.asteroidSize
  );
  
  // Check for collisions and update game logic here
  // This would include bullet movement, collision detection, scoring, etc.
};
