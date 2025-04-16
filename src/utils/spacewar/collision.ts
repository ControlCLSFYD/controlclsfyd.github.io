
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
