
/**
 * Generates star objects for the game background
 */
export const generateStars = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: Math.random() * 1.5 + 0.5,
    brightness: Math.random() * 0.5 + 0.5, // For twinkling effect
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
  asteroidSize: number,
  deltaTime: number
) => {
  asteroids.forEach(asteroid => {
    // Scale movement by deltaTime for consistent speeds
    asteroid.x += asteroid.dx * deltaTime * 60;
    asteroid.y += asteroid.dy * deltaTime * 60;
    
    // Bounce off walls
    if (asteroid.x > canvasWidth - asteroidSize || asteroid.x < asteroidSize) {
      asteroid.dx *= -1;
    }
    if (asteroid.y > canvasHeight - asteroidSize || asteroid.y < asteroidSize) {
      asteroid.dy *= -1;
    }
  });
};

/**
 * Updates the visual appearance of stars for a twinkling effect
 */
export const updateStars = (
  stars: {x: number, y: number, size: number, brightness: number}[],
  deltaTime: number
) => {
  stars.forEach(star => {
    // Randomly adjust brightness for twinkling effect
    if (Math.random() > 0.95) {
      star.brightness = Math.random() * 0.5 + 0.5;
    }
  });
};
