
// This file now serves as a barrel file to re-export all functions
// from the spacewar subdirectory

export { checkCollision } from './spacewar/collision';
export { generateStars, generateAsteroids, updateAsteroids } from './spacewar/environment';
export { initializeGame } from './spacewar/initialization';
export { updateGameState } from './spacewar/gameUpdate';
