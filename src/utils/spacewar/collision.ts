
/**
 * Checks if two objects are colliding based on their positions and sizes
 */
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

/**
 * Check if a point is within the canvas boundaries
 */
export const isInBounds = (
  x: number,
  y: number,
  size: number,
  canvasWidth: number,
  canvasHeight: number
): boolean => {
  return (
    x - size > 0 &&
    x + size < canvasWidth &&
    y - size > 0 &&
    y + size < canvasHeight
  );
};
