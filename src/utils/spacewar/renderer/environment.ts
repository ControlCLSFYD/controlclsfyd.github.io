
/**
 * Rendering functions for environment elements like stars and asteroids
 */

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
    
    // Add some detail to asteroids
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
  });
};

export const drawStars = (
  ctx: CanvasRenderingContext2D, 
  stars: {x: number, y: number, size: number, brightness: number}[]
) => {
  stars.forEach(star => {
    // Set opacity based on star brightness for twinkling effect
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
};

/**
 * Draw a central star/sun in the game
 */
export const drawCentralStar = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number
) => {
  // Create gradient for sun
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 5,
    centerX, centerY, 25
  );
  gradient.addColorStop(0, '#FFFF00');
  gradient.addColorStop(0.3, '#FFAA00');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};
