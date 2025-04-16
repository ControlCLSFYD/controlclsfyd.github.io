
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
