
/**
 * Rendering functions for bullets and projectiles
 */

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
