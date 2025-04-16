
import { useState, useEffect } from 'react';
import { Ship, GameConstants, Projectile } from '../interfaces/SpacewarInterfaces';
import { useWindowSize } from './useWindowSize';

// Initial game constants
const createGameConstants = (canvasWidth: number): GameConstants => ({
  CANVAS_WIDTH: canvasWidth,
  CANVAS_HEIGHT: 400, // Reduced from 600 to 400
  SUN_RADIUS: 30,
  GRAVITY_STRENGTH: 0.15,
  ROTATION_SPEED: 0.1,
  THRUST_POWER: 0.1, // Reduced from 0.2 to 0.1
  WINNING_SCORE: 20,
  DIFFICULTY_MODIFIER: 0,
  FRICTION: 0.99,
  BOUNCE_DAMPENING: 0.7,
  PROJECTILE_SPEED: 5,
  PROJECTILE_SIZE: 3,
  PROJECTILE_INTERVAL: 200 // 0.2 seconds in milliseconds
});

// Initial ship state
const createInitialPlayerShip = (): Ship => ({
  x: 200,
  y: 200, // Adjusted to be centered in the smaller canvas
  rotation: 0,
  velocity: { x: 0, y: 0 },
  thrust: false,
  rotateLeft: false,
  rotateRight: false,
  score: 0,
  size: 5,
  color: '#00ff00'
});

const createInitialCpuShip = (): Ship => ({
  x: 600,
  y: 200, // Adjusted to be centered in the smaller canvas
  rotation: Math.PI,
  velocity: { x: 0, y: 0 },
  thrust: false,
  rotateLeft: false,
  rotateRight: false,
  score: 0,
  size: 5,
  color: '#ff0000'
});

export const useSpacewarGame = (
  difficulty: number = 1,
  onGameOver: (playerWon: boolean) => void
) => {
  const windowSize = useWindowSize();
  const [gameStarted, setGameStarted] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  
  // Calculate canvas width based on window size
  const calculatedCanvasWidth = Math.min(800, windowSize.width - 20);
  const [constants, setConstants] = useState<GameConstants>(createGameConstants(calculatedCanvasWidth));
  
  // Update constants when window size changes
  useEffect(() => {
    setConstants(prev => ({
      ...prev,
      CANVAS_WIDTH: Math.min(800, windowSize.width - 20),
      DIFFICULTY_MODIFIER: 0.2 * difficulty
    }));
  }, [windowSize.width, difficulty]);
  
  // Game entities
  const [player, setPlayer] = useState<Ship>(createInitialPlayerShip());
  const [cpu, setCpu] = useState<Ship>(createInitialCpuShip());
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  
  // Reset game
  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setPlayer(createInitialPlayerShip());
    setCpu(createInitialCpuShip());
    setProjectiles([]);
  };
  
  // Update player controls
  const updatePlayerControls = (control: 'thrust' | 'rotateLeft' | 'rotateRight', active: boolean) => {
    setPlayer(prev => ({ ...prev, [control]: active }));
  };
  
  // Add projectile
  const addProjectile = (newProjectile: Projectile) => {
    setProjectiles(prev => [...prev, newProjectile]);
  };
  
  // Update projectiles
  const updateProjectiles = (updatedProjectiles: Projectile[]) => {
    setProjectiles(updatedProjectiles);
  };
  
  return {
    constants,
    gameStarted,
    gameOver,
    gameWon,
    player,
    setPlayer,
    cpu,
    setCpu,
    projectiles,
    addProjectile,
    updateProjectiles,
    resetGame,
    updatePlayerControls,
    setGameOver,
    setGameWon
  };
};
