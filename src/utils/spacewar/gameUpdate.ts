
import { checkCollision } from './collision';
import { updateAsteroids } from './environment';

/**
 * Updates the game state based on elapsed time and player input
 */
export const updateGameState = (gameState: any, deltaTime: number, difficulty: number) => {
  // Update player position based on input
  if (gameState.player.movingLeft && gameState.player.x > gameState.shipSize) {
    gameState.player.x -= gameState.player.speed * deltaTime;
  }
  if (gameState.player.movingRight && gameState.player.x < gameState.canvasWidth - gameState.shipSize) {
    gameState.player.x += gameState.player.speed * deltaTime;
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
      bullet.y -= gameState.bulletSpeed * deltaTime * 60; // Scale by deltaTime and target 60fps
      
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
      bullet.y += gameState.bulletSpeed * deltaTime * 60; // Scale by deltaTime and target 60fps
      
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
  
  // Check for collisions with asteroids
  gameState.asteroids.forEach(asteroid => {
    // Check for collision with player ship
    if (checkCollision(
      asteroid.x, asteroid.y, gameState.asteroidSize,
      gameState.player.x, gameState.player.y, gameState.shipSize
    )) {
      // Player loses a point when hitting an asteroid
      gameState.computerScore++;
      gameState.scoreChanged = true;
      
      // Reset asteroid position
      asteroid.x = Math.random() * gameState.canvasWidth;
      asteroid.y = Math.random() * (gameState.canvasHeight / 2) + 50;
    }
    
    // Check for collision with enemy ship
    if (checkCollision(
      asteroid.x, asteroid.y, gameState.asteroidSize,
      gameState.enemy.x, gameState.enemy.y, gameState.shipSize
    )) {
      // Enemy loses a point when hitting an asteroid
      gameState.userScore++;
      gameState.scoreChanged = true;
      
      // Reset asteroid position
      asteroid.x = Math.random() * gameState.canvasWidth;
      asteroid.y = Math.random() * (gameState.canvasHeight / 2) + 50;
    }
  });
  
  // Update asteroids
  updateAsteroids(gameState.asteroids, gameState.canvasWidth, gameState.canvasHeight, gameState.asteroidSize, deltaTime);
};
