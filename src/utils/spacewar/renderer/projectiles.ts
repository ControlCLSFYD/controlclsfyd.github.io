
/**
 * Rendering functions for bullets and projectiles
 */

export const drawBullets = (
  ctx: CanvasRenderingContext2D, 
  playerBullets: { x: number; y: number; active: boolean }[], 
  enemyBullets: { x: number; y: number; active: boolean }[], 
  bulletSize: number
) => {
  // Draw player bullets with a glow effect
  playerBullets.forEach(bullet => {
    if (bullet.active) {
      // Draw glow
      const gradient = ctx.createRadialGradient(
        bullet.x, bullet.y, 0,
        bullet.x, bullet.y, bulletSize * 2
      );
      gradient.addColorStop(0, 'rgba(214, 188, 250, 0.8)');
      gradient.addColorStop(1, 'rgba(214, 188, 250, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bulletSize * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      
      // Draw bullet core
      ctx.fillStyle = '#D6BCFA';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  });
  
  // Draw enemy bullets with a glow effect
  enemyBullets.forEach(bullet => {
    if (bullet.active) {
      // Draw glow
      const gradient = ctx.createRadialGradient(
        bullet.x, bullet.y, 0,
        bullet.x, bullet.y, bulletSize * 2
      );
      gradient.addColorStop(0, 'rgba(126, 105, 171, 0.8)');
      gradient.addColorStop(1, 'rgba(126, 105, 171, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bulletSize * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      
      // Draw bullet core
      ctx.fillStyle = '#7E69AB';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  });
};
