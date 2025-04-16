
/**
 * Rendering functions for player and enemy ships
 */

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
  
  // Add a gradient for better visuals
  const gradient = ctx.createLinearGradient(
    playerX, playerY - shipSize,
    playerX, playerY + shipSize
  );
  gradient.addColorStop(0, '#D6BCFA');
  gradient.addColorStop(1, '#9F7AEA');
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Add engine glow
  ctx.beginPath();
  ctx.moveTo(playerX - shipSize/2, playerY + shipSize);
  ctx.lineTo(playerX + shipSize/2, playerY + shipSize);
  ctx.lineTo(playerX, playerY + shipSize + shipSize/2);
  ctx.closePath();
  ctx.fillStyle = '#FFA500';
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
  
  // Add a gradient for better visuals
  const gradient = ctx.createLinearGradient(
    enemyX, enemyY + shipSize,
    enemyX, enemyY - shipSize
  );
  gradient.addColorStop(0, '#7E69AB');
  gradient.addColorStop(1, '#553C9A');
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Add engine glow
  ctx.beginPath();
  ctx.moveTo(enemyX - shipSize/2, enemyY - shipSize);
  ctx.lineTo(enemyX + shipSize/2, enemyY - shipSize);
  ctx.lineTo(enemyX, enemyY - shipSize - shipSize/2);
  ctx.closePath();
  ctx.fillStyle = '#FF4500';
  ctx.fill();
};
