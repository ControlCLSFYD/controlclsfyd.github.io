
import { generateStars, generateAsteroids } from './environment';
import { GameStateRef } from '../../hooks/spacewar/types';

/**
 * Initialize the game state with all required properties
 */
export const initializeGame = (canvasWidth: number, canvasHeight: number, difficulty: number): GameStateRef => {
  // Ship and bullet settings
  const shipSize = 10;
  const bulletSize = 3;
  const playerSpeed = 200; // Units per second (will be multiplied by deltaTime)
  const enemySpeed = 100 + difficulty * 20; // Units per second
  const bulletSpeed = 7;

  // Calculate initial positions
  const playerX = canvasWidth / 2;
  const playerY = canvasHeight - 50;
  const enemyX = canvasWidth / 2;
  const enemyY = 50;

  // Generate stars and asteroids
  const stars = generateStars(100, canvasWidth, canvasHeight);
  const asteroidCount = Math.min(5 + difficulty, 12);
  const asteroids = generateAsteroids(asteroidCount, canvasWidth, canvasHeight);
  const asteroidSize = 15;

  // Create game state object
  return {
    // Canvas dimensions
    canvasWidth,
    canvasHeight,
    
    // Game objects
    player: {
      x: playerX,
      y: playerY,
      movingLeft: false,
      movingRight: false,
      speed: playerSpeed,
      shootCooldown: 0,
    },
    enemy: {
      x: enemyX,
      y: enemyY,
      speed: enemySpeed,
      direction: 1,
      shootCooldown: 0,
    },
    playerBullets: Array(10).fill(0).map(() => ({ x: 0, y: 0, active: false })),
    enemyBullets: Array(10).fill(0).map(() => ({ x: 0, y: 0, active: false })),
    
    // Environment
    stars,
    asteroids,
    
    // Game settings
    shipSize,
    bulletSize,
    bulletSpeed,
    asteroidSize,
    
    // Game state
    userScore: 0,
    computerScore: 0,
    scoreChanged: false,
    
    // Timing
    lastEnemyMoveTime: 0,
    enemyMoveDelay: 500 / (difficulty + 1),
    lastEnemyShootTime: 0,
    enemyShootDelay: 1500 / (difficulty + 0.5),
  };
};
