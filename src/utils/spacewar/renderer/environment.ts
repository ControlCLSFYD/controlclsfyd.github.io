
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
