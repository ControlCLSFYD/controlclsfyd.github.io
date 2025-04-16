
import { useState, useEffect } from 'react';
import { Ship, Beam, GameConstants } from '../interfaces/SpacewarInterfaces';
import { createBeam, fireBeamProjectile } from '../utils/spacewarWeapons';
import { 
  checkBeamHit, applySunGravity, 
  handleSunCollision, handleBorderCollision, applyFriction 
} from '../utils/spacewarUtils';
import { createInitialAIState, updateCpuAI } from '../utils/spacewarCpuAI';
import { useWindowSize } from './useWindowSize';

// Initial game constants
const createGameConstants = (canvasWidth: number): GameConstants => ({
  CANVAS_WIDTH: canvasWidth,
  CANVAS_HEIGHT: 600,
  SUN_RADIUS: 30,
  GRAVITY_STRENGTH: 0.15,
  ROTATION_SPEED: 0.1,
  THRUST_POWER: 0.2,
  BEAM_LENGTH: 100,
  BEAM_COOLDOWN: 30,
  BEAM_DURATION: 45,
  BEAM_PROJECTILE_SPEED: 12,
  BEAM_PROJECTILE_LIFESPAN: 90,
  WINNING_SCORE: 20,
  DIFFICULTY_MODIFIER: 0,
  FRICTION: 0.99,
  BOUNCE_DAMPENING: 0.7
});

// Initial ship state - with smaller size (1/3 of original)
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
  color: '#00ff00',
  beamActive: false,
  beamCooldown: 0,
  beamLength: 100
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
  color: '#ff0000',
  beamActive: false,
  beamCooldown: 0,
  beamLength: 100
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
  const [playerBeam, setPlayerBeam] = useState<Beam | null>(null);
  const [cpuBeam, setCpuBeam] = useState<Beam | null>(null);
  
  // Reset game
  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setPlayer(createInitialPlayerShip());
    setCpu(createInitialCpuShip());
    setPlayerBeam(null);
    setCpuBeam(null);
  };
  
  // Fire handler for player's beam
  const handleFirePlayerBeam = () => {
    if (player.beamCooldown <= 0) {
      const newBeam = createBeam('player', {
        ...player,
        beamLength: constants.BEAM_LENGTH
      });
      setPlayerBeam(newBeam);
      
      setPlayer(prev => ({ 
        ...prev, 
        beamActive: true,
        beamCooldown: constants.BEAM_COOLDOWN
      }));
      
      // After a short delay, fire the projectile
      setTimeout(() => {
        if (playerBeam) {
          const beamWithProjectile = fireBeamProjectile(
            playerBeam,
            constants.BEAM_PROJECTILE_SPEED,
            constants.BEAM_PROJECTILE_LIFESPAN
          );
          setPlayerBeam(beamWithProjectile);
        }
      }, 200);
    }
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
    playerBeam,
    setPlayerBeam,
    cpuBeam,
    setCpuBeam,
    resetGame,
    handleFirePlayerBeam,
    updatePlayerControls,
    setGameOver,
    setGameWon
  };
};
