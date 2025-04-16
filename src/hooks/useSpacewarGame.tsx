
import { useState, useEffect } from 'react';
import { Ship, Torpedo, GameConstants } from '../interfaces/SpacewarInterfaces';
import { fireSpecialWeapon, fireStandardWeapon, fireTorpedo } from '../utils/spacewarWeapons';
import { checkTorpedoHit, applySunGravity, wrapPosition, handleSunCollision } from '../utils/spacewarUtils';
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
  TORPEDO_SPEED: 6,
  STANDARD_TORPEDO_SPEED: 10,
  SPECIAL_TORPEDO_SPEED: 8,
  TORPEDO_LIFESPAN: 60,
  STANDARD_TORPEDO_LIFESPAN: 90,
  SPECIAL_TORPEDO_LIFESPAN: 80,
  PLAYER_FIRE_RATE: 400,
  CPU_FIRE_RATE: 350,
  STANDARD_WEAPON_FIRE_RATE: 300,
  STANDARD_WEAPON_COOLDOWN: 1000,
  SPECIAL_WEAPON_COOLDOWN: 10000,
  WINNING_SCORE: 20,
  RAPID_FIRE_COUNT: 10,
  DIFFICULTY_MODIFIER: 0 // Will be set based on difficulty prop
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
  size: 15,
  color: '#00ff00',
  specialWeaponCharge: 100,
  standardWeaponCharge: 100,
  firingSpecial: false,
  firingStandard: false,
  rapidFireCount: 0
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
  size: 15,
  color: '#ff0000',
  specialWeaponCharge: 100,
  standardWeaponCharge: 100,
  firingSpecial: false,
  firingStandard: false,
  rapidFireCount: 0
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
  const [torpedoes, setTorpedoes] = useState<Torpedo[]>([]);
  
  // Timing variables
  const [lastPlayerFire, setLastPlayerFire] = useState<number>(0);
  const [lastCpuFire, setLastCpuFire] = useState<number>(0);
  const [lastRapidFireTime, setLastRapidFireTime] = useState<number>(0);
  const [lastPlayerStandardFire, setLastPlayerStandardFire] = useState<number>(0);
  const [lastCpuStandardFire, setLastCpuStandardFire] = useState<number>(0);
  
  // Handle player rapid fire
  useEffect(() => {
    if (player.rapidFireCount > 0) {
      const now = Date.now();
      if (now - lastRapidFireTime >= constants.STANDARD_WEAPON_FIRE_RATE) {
        // Fire the next shot in the sequence
        const torpedo = fireStandardWeapon('player', player, constants.STANDARD_TORPEDO_SPEED, constants.STANDARD_TORPEDO_LIFESPAN);
        setTorpedoes(prev => [...prev, torpedo]);
        setLastRapidFireTime(now);
        
        // Decrement the rapid fire counter
        setPlayer(prev => ({
          ...prev,
          rapidFireCount: prev.rapidFireCount - 1,
          firingStandard: prev.rapidFireCount > 1
        }));
      }
    }
  }, [player.rapidFireCount, lastRapidFireTime, constants]);
  
  // Reset game
  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setPlayer(createInitialPlayerShip());
    setCpu(createInitialCpuShip());
    setTorpedoes([]);
  };
  
  // Fire handler for player's special weapon
  const handleFireSpecialWeapon = () => {
    if (player.specialWeaponCharge >= 100) {
      const torpedo = fireSpecialWeapon('player', player, constants.SPECIAL_TORPEDO_SPEED, constants.SPECIAL_TORPEDO_LIFESPAN);
      setTorpedoes(prev => [...prev, torpedo]);
      
      setPlayer(prev => ({ ...prev, specialWeaponCharge: 0, firingSpecial: true }));
      setTimeout(() => {
        setPlayer(prev => ({ ...prev, firingSpecial: false }));
      }, 500);
    }
  };
  
  // Fire handler for player's standard weapon
  const handleFireStandardWeapon = () => {
    if (player.standardWeaponCharge >= 100 && player.rapidFireCount === 0) {
      // Start rapid fire sequence
      setPlayer(prev => ({ 
        ...prev, 
        standardWeaponCharge: 0, 
        firingStandard: true, 
        rapidFireCount: constants.RAPID_FIRE_COUNT 
      }));
      
      // Fire the first shot immediately
      const torpedo = fireStandardWeapon('player', player, constants.STANDARD_TORPEDO_SPEED, constants.STANDARD_TORPEDO_LIFESPAN);
      setTorpedoes(prev => [...prev, torpedo]);
      setLastRapidFireTime(Date.now());
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
    torpedoes,
    setTorpedoes,
    lastPlayerFire,
    setLastPlayerFire,
    lastCpuFire,
    setLastCpuFire,
    resetGame,
    handleFireSpecialWeapon,
    handleFireStandardWeapon,
    updatePlayerControls,
    setGameOver,
    setGameWon
  };
};
