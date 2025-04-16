
import { useState, useEffect } from 'react';
import { Ship, GameConstants } from '../interfaces/SpacewarInterfaces';
import { useWindowSize } from './useWindowSize';

// Initial game constants
const createGameConstants = (canvasWidth: number): GameConstants => ({
  CANVAS_WIDTH: canvasWidth,
  CANVAS_HEIGHT: 600,
  SUN_RADIUS: 30,
  GRAVITY_STRENGTH: 0.15,
  ROTATION_SPEED: 0.1,
  THRUST_POWER: 0.2,
  WINNING_SCORE: 20,
  DIFFICULTY_MODIFIER: 0,
  FRICTION: 0.99,
  BOUNCE_DAMPENING: 0.7
});

// Initial ship state
const createInitialPlayerShip = (): Ship => ({
  x: 200,
  y: 300,
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
  y: 300,
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
  
  // Reset game
  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setPlayer(createInitialPlayerShip());
    setCpu(createInitialCpuShip());
  };
  
  // Update player controls
  const updatePlayerControls = (control: 'thrust' | 'rotateLeft' | 'rotateRight', active: boolean) => {
    setPlayer(prev => ({ ...prev, [control]: active }));
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
    resetGame,
    updatePlayerControls,
    setGameOver,
    setGameWon
  };
};
