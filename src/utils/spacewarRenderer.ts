
/**
 * This file now serves as a barrel file to re-export all renderer functions
 * from the spacewar/renderer subdirectory
 */

export { drawPlayerShip, drawEnemyShip } from './spacewar/renderer/ships';
export { drawBullets } from './spacewar/renderer/projectiles';
export { drawAsteroids, drawStars } from './spacewar/renderer/environment';
export { drawGame } from './spacewar/renderer/main';
