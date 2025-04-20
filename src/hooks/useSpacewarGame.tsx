import { useState, useEffect, useRef } from 'react';
import { Ship, GameConstants, Projectile } from '../interfaces/SpacewarInterfaces';
import { useWindowSize } from './useWindowSize';
import { 
  ScoreState, createScoreState, incrementPlayerScore, incrementCpuScore
} from '../systems/scoringSystem';
import { AutofireManager, createAutofireManager } from '../systems/projectileSystem';

// Initial game constants
const createGameConstants = (canvasWidth: number): GameConstants => ({
  CANVAS_WIDTH: canvasWidth,
  CANVAS_HEIGHT: 400,
  SUN_RADIUS: 30,
  GRAVITY_STRENGTH: 0.15,
  ROTATION_SPEED: 0.1,
  THRUST_POWER: 0.05,
  REQUIRED_HITS: 5,
  TIME_LIMIT: 15,
  DIFFICULTY_MODIFIER: 0,
  FRICTION: 0.99,
  BOUNCE_DAMPENING: 0.7,
  PROJECTILE_SPEED: 5,
  PROJECTILE_SIZE: 3,
  PROJECTILE_INTERVAL: 250,
  SPECIAL_PROJECTILE_SPEED: 20,
  SPECIAL_PROJECTILE_SIZE: 4,
  SPECIAL_PROJECTILE_COLOR: '#ffff00'
});

// Initial ship state
const createInitialPlayerShip = (): Ship => ({
  x: 200,
  y: 200,
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
  y: 200,
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
  
  // Calculate canvas width based on window size
  const calculatedCanvasWidth = Math.min(800, windowSize.width - 20);
  const [constants, setConstants] = useState<GameConstants>(createGameConstants(calculatedCanvasWidth));
  
  // Scoring system state
  const [scoreState, setScoreState] = useState<ScoreState>(createScoreState(constants.WINNING_SCORE));
  
  // Autofire manager ref
  const autofireManagerRef = useRef<AutofireManager>(createAutofireManager());
  
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
  
  // Score updater functions
  const updatePlayerScore = (increment: number) => {
    setScoreState(prev => {
      const updated = incrementPlayerScore(prev);
      if (updated.gameOver) {
        onGameOver(true);
      }
      return updated;
    });
  };
  
  const updateCpuScore = (increment: number) => {
    setScoreState(prev => {
      const updated = incrementCpuScore(prev);
      if (updated.gameOver) {
        onGameOver(false);
      }
      return updated;
    });
  };
  
  // Reset game
  const resetGame = () => {
    setGameStarted(true);
    setScoreState(createScoreState(constants.WINNING_SCORE));
    setPlayer(createInitialPlayerShip());
    setCpu(createInitialCpuShip());
    setProjectiles([]);
    autofireManagerRef.current = createAutofireManager();
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
    scoreState,
    player,
    setPlayer,
    cpu,
    setCpu,
    projectiles,
    addProjectile,
    updateProjectiles,
    resetGame,
    updatePlayerControls,
    updatePlayerScore,
    updateCpuScore,
    autofireManagerRef
  };
};
