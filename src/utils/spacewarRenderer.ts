
// Rendering functions for Spacewar game elements

export const drawPlayerShip = (
  ctx: CanvasRenderingContext2D, 
  playerX: number, 
  playerY: number, 
  shipSize: number
) => {
  ctx.beginPath();
  ctx.moveTo(playerX, playerY - shipSize);
  ctx.lineTo(playerX + shipSize, playerY + shipSize);
  ctx.lineTo(playerX - shipSize, playerY + shipSize);
  ctx.closePath();
  ctx.fillStyle = '#D6BCFA';
  ctx.fill();
};

export const drawEnemyShip = (
  ctx: CanvasRenderingContext2D, 
  enemyX: number, 
  enemyY: number, 
  shipSize: number
) => {
  ctx.beginPath();
  ctx.moveTo(enemyX, enemyY + shipSize);
  ctx.lineTo(enemyX + shipSize, enemyY - shipSize);
  ctx.lineTo(enemyX - shipSize, enemyY - shipSize);
  ctx.closePath();
  ctx.fillStyle = '#7E69AB';
  ctx.fill();
};

export const drawBullets = (
  ctx: CanvasRenderingContext2D, 
  playerBullets: { x: number; y: number; active: boolean }[], 
  enemyBullets: { x: number; y: number; active: boolean }[], 
  bulletSize: number
) => {
  ctx.fillStyle = '#D6BCFA';
  playerBullets.forEach(bullet => {
    if (bullet.active) {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  });
  
  ctx.fillStyle = '#7E69AB';
  enemyBullets.forEach(bullet => {
    if (bullet.active) {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  });
};

export const drawAsteroids = (
  ctx: CanvasRenderingContext2D, 
  asteroids: {x: number, y: number, dx: number, dy: number}[], 
  asteroidSize: number
) => {
  ctx.fillStyle = '#9F9EA1';
  asteroids.forEach(asteroid => {
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroidSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
};

export const drawStars = (
  ctx: CanvasRenderingContext2D, 
  stars: {x: number, y: number, size: number}[]
) => {
  ctx.fillStyle = '#FFFFFF';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
};

// Main draw function that uses all the individual draw functions
export const drawGame = (
  ctx: CanvasRenderingContext2D,
  gameState: any
) => {
  // Clear the canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw stars
  if (gameState.stars) {
    drawStars(ctx, gameState.stars);
  }
  
  // Draw asteroids
  if (gameState.asteroids) {
    drawAsteroids(ctx, gameState.asteroids, gameState.asteroidSize || 10);
  }
  
  // Draw player
  if (gameState.player) {
    drawPlayerShip(ctx, gameState.player.x, gameState.player.y, gameState.shipSize || 10);
  }
  
  // Draw enemy
  if (gameState.enemy) {
    drawEnemyShip(ctx, gameState.enemy.x, gameState.enemy.y, gameState.shipSize || 10);
  }
  
  // Draw bullets
  if (gameState.playerBullets && gameState.enemyBullets) {
    drawBullets(
      ctx, 
      gameState.playerBullets, 
      gameState.enemyBullets, 
      gameState.bulletSize || 2
    );
  }
  
  // Draw score
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px monospace';
  if (gameState.userScore !== undefined && gameState.computerScore !== undefined) {
    ctx.fillText(`PLAYER: ${gameState.userScore}  CPU: ${gameState.computerScore}`, 10, 20);
  }
};
