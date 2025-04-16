
/**
 * Main rendering function that coordinates all drawing operations
 */

import { drawPlayerShip, drawEnemyShip } from './ships';
import { drawBullets } from './projectiles';
import { drawAsteroids, drawStars, drawCentralStar } from './environment';

// Main drawing function that renders the entire game
export const drawGame = (
  ctx: CanvasRenderingContext2D,
  gameState: any
) => {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw stars in the background
  drawStars(ctx, gameState.stars);
  
  // Draw central star
  drawCentralStar(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2);
  
  // Draw asteroids
  drawAsteroids(ctx, gameState.asteroids, gameState.asteroidSize);
  
  // Draw player and enemy ships
  drawPlayerShip(ctx, gameState.player.x, gameState.player.y, gameState.shipSize);
  drawEnemyShip(ctx, gameState.enemy.x, gameState.enemy.y, gameState.shipSize);
  
  // Draw bullets
  drawBullets(ctx, gameState.playerBullets, gameState.enemyBullets, gameState.bulletSize);
};
