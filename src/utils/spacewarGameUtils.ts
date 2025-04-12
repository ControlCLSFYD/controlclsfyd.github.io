
// Utility functions for the Spacewar game

export const checkCollision = (
  x1: number, 
  y1: number, 
  size1: number, 
  x2: number, 
  y2: number, 
  size2: number
): boolean => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance < (size1 + size2);
};

export const generateStars = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: Math.random() * 1.5 + 0.5,
  }));
};

export const generateAsteroids = (count: number, canvasWidth: number, canvasHeight: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * (canvasHeight / 2) + 100,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
  }));
};

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
