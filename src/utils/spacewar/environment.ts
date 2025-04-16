
/**
 * Generates star objects for the game background
 */
export const generateStars = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: Math.random() * 1.5 + 0.5,
  }));
};

/**
 * Generates asteroid objects for the game
 */
export const generateAsteroids = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * (canvasHeight / 2) + 100,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
  }));
};

/**
 * Updates the positions of asteroids and handles boundary collisions
 */
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
