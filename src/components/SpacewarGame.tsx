
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';

interface Ship {
  x: number;
  y: number;
  rotation: number;
  velocity: { x: number; y: number };
  thrust: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
  score: number;
  size: number;
  color: string;
  specialWeaponCharge: number;
  standardWeaponCharge: number;
  firingSpecial: boolean;
  firingStandard: boolean;
}

interface Torpedo {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  alive: boolean;
  owner: 'player' | 'cpu';
  lifespan: number;
  isSpecial?: boolean;
  isStandard?: boolean;
}

const SpacewarGame: React.FC<BaseGameProps> = ({
  onGameComplete,
  onPlayAgain,
  difficulty = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState({
    gameStarted: false,
    gameOver: false,
    gameWon: false,
    score: 0,
  });
  
  const [player, setPlayer] = useState<Ship>({
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
    firingStandard: false
  });
  
  const [cpu, setCpu] = useState<Ship>({
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
    firingStandard: false
  });
  
  const [torpedoes, setTorpedoes] = useState<Torpedo[]>([]);
  const [lastPlayerFire, setLastPlayerFire] = useState(0);
  const [lastCpuFire, setLastCpuFire] = useState(0);
  const [lastPlayerStandardFire, setLastPlayerStandardFire] = useState(0);
  const [lastCpuStandardFire, setLastCpuStandardFire] = useState(0);
  
  const PLAYER_FIRE_RATE = 400; // ms between shots
  const CPU_FIRE_RATE = 350; // CPU fires slightly faster
  const STANDARD_WEAPON_FIRE_RATE = 700; // ms between standard shots
  const STANDARD_WEAPON_COOLDOWN = 2000; // 2 seconds cooldown
  const SPECIAL_WEAPON_COOLDOWN = 10000; // 10 seconds cooldown
  const WINNING_SCORE = 20;
  
  // Game constants
  const CANVAS_WIDTH = Math.min(800, window.innerWidth - 20);
  const CANVAS_HEIGHT = 600;
  const SUN_RADIUS = 30;
  const GRAVITY_STRENGTH = 0.15;
  const ROTATION_SPEED = 0.1;
  const THRUST_POWER = 0.2;
  const TORPEDO_SPEED = 6;
  const STANDARD_TORPEDO_SPEED = 7;
  const SPECIAL_TORPEDO_SPEED = 8;
  const TORPEDO_LIFESPAN = 60; // frames
  const STANDARD_TORPEDO_LIFESPAN = 70; // frames
  const SPECIAL_TORPEDO_LIFESPAN = 80; // frames
  const DIFFICULTY_MODIFIER = 0.2 * difficulty;
  
  // Setup keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          setPlayer(prev => ({ ...prev, thrust: true }));
          break;
        case 'ArrowLeft':
          setPlayer(prev => ({ ...prev, rotateLeft: true }));
          break;
        case 'ArrowRight':
          setPlayer(prev => ({ ...prev, rotateRight: true }));
          break;
        case ' ': // Spacebar for standard weapon
          if (player.standardWeaponCharge >= 100) {
            fireStandardWeapon('player', player);
            setPlayer(prev => ({ ...prev, standardWeaponCharge: 0, firingStandard: true }));
            setTimeout(() => {
              setPlayer(prev => ({ ...prev, firingStandard: false }));
            }, 300);
          }
          break;
        case 'b': // B key for special weapon
        case 'B':
          if (player.specialWeaponCharge >= 100) {
            fireSpecialWeapon('player', player);
            setPlayer(prev => ({ ...prev, specialWeaponCharge: 0, firingSpecial: true }));
            setTimeout(() => {
              setPlayer(prev => ({ ...prev, firingSpecial: false }));
            }, 500);
          }
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setPlayer(prev => ({ ...prev, thrust: false }));
          break;
        case 'ArrowLeft':
          setPlayer(prev => ({ ...prev, rotateLeft: false }));
          break;
        case 'ArrowRight':
          setPlayer(prev => ({ ...prev, rotateRight: false }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.gameOver, player.specialWeaponCharge, player.standardWeaponCharge]);
  
  // Initialize game
  useEffect(() => {
    setGameState({ gameStarted: true, gameOver: false, gameWon: false, score: 0 });
    
    // Reset player and CPU
    setPlayer({
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
      firingStandard: false
    });
    
    setCpu({
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
      firingStandard: false
    });
    
    setTorpedoes([]);
  }, []);

  // Special weapon handlers
  const fireSpecialWeapon = (owner: 'player' | 'cpu', ship: Ship) => {
    const torpedo: Torpedo = {
      x: ship.x + Math.cos(ship.rotation) * (ship.size + 5),
      y: ship.y + Math.sin(ship.rotation) * (ship.size + 5),
      velocity: {
        x: ship.velocity.x + Math.cos(ship.rotation) * SPECIAL_TORPEDO_SPEED,
        y: ship.velocity.y + Math.sin(ship.rotation) * SPECIAL_TORPEDO_SPEED
      },
      alive: true,
      owner: owner,
      lifespan: SPECIAL_TORPEDO_LIFESPAN,
      isSpecial: true
    };
    
    setTorpedoes(prev => [...prev, torpedo]);
  };

  // Standard weapon handler
  const fireStandardWeapon = (owner: 'player' | 'cpu', ship: Ship) => {
    const torpedo: Torpedo = {
      x: ship.x + Math.cos(ship.rotation) * (ship.size + 5),
      y: ship.y + Math.sin(ship.rotation) * (ship.size + 5),
      velocity: {
        x: ship.velocity.x + Math.cos(ship.rotation) * STANDARD_TORPEDO_SPEED,
        y: ship.velocity.y + Math.sin(ship.rotation) * STANDARD_TORPEDO_SPEED
      },
      alive: true,
      owner: owner,
      lifespan: STANDARD_TORPEDO_LIFESPAN,
      isStandard: true
    };
    
    setTorpedoes(prev => [...prev, torpedo]);
  };
  
  // Regular torpedo fire
  const fireTorpedo = (owner: 'player' | 'cpu', ship: Ship) => {
    const torpedo: Torpedo = {
      x: ship.x + Math.cos(ship.rotation) * (ship.size + 5),
      y: ship.y + Math.sin(ship.rotation) * (ship.size + 5),
      velocity: {
        x: ship.velocity.x + Math.cos(ship.rotation) * TORPEDO_SPEED,
        y: ship.velocity.y + Math.sin(ship.rotation) * TORPEDO_SPEED
      },
      alive: true,
      owner: owner,
      lifespan: TORPEDO_LIFESPAN,
      isSpecial: false,
      isStandard: false
    };
    
    setTorpedoes(prev => [...prev, torpedo]);
  };
  
  // Main game loop
  useEffect(() => {
    if (!canvasRef.current || !gameState.gameStarted || gameState.gameOver) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    let cpuSpecialWeaponTimer = 0;
    let cpuStandardWeaponTimer = 0;
    let cpuDecisionTimer = 0;
    let cpuTargetPosition = { x: 0, y: 0 };
    
    const gameLoop = (timestamp: number) => {
      if (!canvasRef.current) return;
      
      // Cap the frame rate
      if (timestamp - lastTime < 16) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = timestamp;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw sun
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, SUN_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Update player ship
      const updatedPlayer = { ...player };
      
      // Recharge special weapon
      if (updatedPlayer.specialWeaponCharge < 100) {
        updatedPlayer.specialWeaponCharge = Math.min(100, updatedPlayer.specialWeaponCharge + 0.16); // Full recharge in 10 seconds
      }
      
      // Recharge standard weapon
      if (updatedPlayer.standardWeaponCharge < 100) {
        updatedPlayer.standardWeaponCharge = Math.min(100, updatedPlayer.standardWeaponCharge + 0.83); // Full recharge in 2 seconds
      }
      
      // Auto-fire normal weapon
      const now = Date.now();
      if (now - lastPlayerFire > PLAYER_FIRE_RATE) {
        fireTorpedo('player', player);
        setLastPlayerFire(now);
      }
      
      if (player.rotateLeft) {
        updatedPlayer.rotation -= ROTATION_SPEED;
      }
      if (player.rotateRight) {
        updatedPlayer.rotation += ROTATION_SPEED;
      }
      
      if (player.thrust) {
        updatedPlayer.velocity.x += Math.cos(player.rotation) * THRUST_POWER;
        updatedPlayer.velocity.y += Math.sin(player.rotation) * THRUST_POWER;
      }
      
      // Apply sun gravity to player
      const playerToSun = {
        x: CANVAS_WIDTH / 2 - player.x,
        y: CANVAS_HEIGHT / 2 - player.y
      };
      const playerDistanceToSun = Math.sqrt(playerToSun.x * playerToSun.x + playerToSun.y * playerToSun.y);
      
      // Apply gravity but handle sun collision with respawn
      if (playerDistanceToSun > SUN_RADIUS) {
        const gravityFactor = GRAVITY_STRENGTH / (playerDistanceToSun * 0.1);
        updatedPlayer.velocity.x += (playerToSun.x / playerDistanceToSun) * gravityFactor;
        updatedPlayer.velocity.y += (playerToSun.y / playerDistanceToSun) * gravityFactor;
      } else {
        // Respawn on opposite side of the sun
        const respawnDistance = 100;
        const respawnAngle = Math.atan2(playerToSun.y, playerToSun.x) + Math.PI;
        updatedPlayer.x = CANVAS_WIDTH / 2 + Math.cos(respawnAngle) * respawnDistance;
        updatedPlayer.y = CANVAS_HEIGHT / 2 + Math.sin(respawnAngle) * respawnDistance;
        updatedPlayer.velocity = { x: 0, y: 0 };
      }
      
      // Update player position
      updatedPlayer.x += updatedPlayer.velocity.x;
      updatedPlayer.y += updatedPlayer.velocity.y;
      
      // Wrap around edges
      if (updatedPlayer.x > CANVAS_WIDTH) updatedPlayer.x = 0;
      if (updatedPlayer.x < 0) updatedPlayer.x = CANVAS_WIDTH;
      if (updatedPlayer.y > CANVAS_HEIGHT) updatedPlayer.y = 0;
      if (updatedPlayer.y < 0) updatedPlayer.y = CANVAS_HEIGHT;
      
      setPlayer(updatedPlayer);
      
      // Update CPU ship with enhanced AI
      const updatedCpu = { ...cpu };
      
      // Recharge CPU special weapon
      if (updatedCpu.specialWeaponCharge < 100) {
        updatedCpu.specialWeaponCharge = Math.min(100, updatedCpu.specialWeaponCharge + 0.16);
      }

      // Recharge CPU standard weapon
      if (updatedCpu.standardWeaponCharge < 100) {
        updatedCpu.standardWeaponCharge = Math.min(100, updatedCpu.standardWeaponCharge + 0.83);
      }
      
      // CPU auto-fire normal weapon
      if (now - lastCpuFire > CPU_FIRE_RATE) {  // CPU fires slightly faster
        fireTorpedo('cpu', cpu);
        setLastCpuFire(now);
      }

      // CPU standard weapon firing logic
      cpuStandardWeaponTimer++;
      
      // Fire standard weapon when charged and player is in medium range
      const distanceToPlayer = Math.sqrt(
        Math.pow(player.x - cpu.x, 2) + Math.pow(player.y - cpu.y, 2)
      );
      
      const angleToPlayer = Math.atan2(player.y - cpu.y, player.x - cpu.x);
      const angleToPlayerDiff = Math.abs(normalizeAngle(angleToPlayer - updatedCpu.rotation));
      
      if (updatedCpu.standardWeaponCharge >= 100 && 
          distanceToPlayer < 300 && angleToPlayerDiff < 0.6) {
        cpuStandardWeaponTimer = 0;
        fireStandardWeapon('cpu', cpu);
        updatedCpu.standardWeaponCharge = 0;
        updatedCpu.firingStandard = true;
        setTimeout(() => {
          setCpu(prev => ({ ...prev, firingStandard: false }));
        }, 300);
      }

      // CPU special weapon firing logic - more strategic
      cpuSpecialWeaponTimer++;
      
      // Fire special weapon when:
      // 1. It's charged
      // 2. AND either: a) player is close and in front, OR b) every ~8 seconds
      const playerInFrontAndClose = distanceToPlayer < 200 && angleToPlayerDiff < 0.5;
      
      if (updatedCpu.specialWeaponCharge >= 100 && 
          (playerInFrontAndClose || cpuSpecialWeaponTimer > 480)) {
        cpuSpecialWeaponTimer = 0;
        fireSpecialWeapon('cpu', cpu);
        updatedCpu.specialWeaponCharge = 0;
        updatedCpu.firingSpecial = true;
        setTimeout(() => {
          setCpu(prev => ({ ...prev, firingSpecial: false }));
        }, 500);
      }
      
      // Enhanced CPU AI logic
      cpuDecisionTimer++;
      
      // Update target position every 2 seconds
      if (cpuDecisionTimer >= 120) {
        cpuDecisionTimer = 0;
        
        // Predict player's future position based on velocity
        const predictionFactor = 1.5 + difficulty * 0.8; // Higher difficulty = better prediction
        const predictedPlayerX = player.x + player.velocity.x * predictionFactor;
        const predictedPlayerY = player.y + player.velocity.y * predictionFactor;
        
        // Choose between strategies based on difficulty and game state
        // 1. Chase player (60-80% chance based on difficulty)
        // 2. Navigate to strategic position (20-40% chance)
        // 3. Perform orbital maneuver around sun (new strategy)
        const chasePlayerChance = 0.6 + (difficulty * 0.05);
        const orbitalManeuverChance = 0.2 + (difficulty * 0.03);
        
        const strategyRoll = Math.random();
        
        if (strategyRoll < chasePlayerChance) {
          // Chase player strategy
          cpuTargetPosition = { x: predictedPlayerX, y: predictedPlayerY };
        } else if (strategyRoll < chasePlayerChance + orbitalManeuverChance) {
          // Orbital maneuver - use sun's gravity to orbit and gain positional advantage
          const orbitDistance = 120 + Math.random() * 50;
          const orbitAngle = Math.atan2(cpu.y - CANVAS_HEIGHT/2, cpu.x - CANVAS_WIDTH/2);
          const orbitTargetAngle = orbitAngle + 0.3; // Move in orbital direction
          
          cpuTargetPosition = {
            x: CANVAS_WIDTH/2 + Math.cos(orbitTargetAngle) * orbitDistance,
            y: CANVAS_HEIGHT/2 + Math.sin(orbitTargetAngle) * orbitDistance
          };
        } else {
          // Strategic position - find a position with good firing angle
          // Calculate a position at a moderate distance from player
          const strategicDistance = 200 + Math.random() * 100;
          const randomAngle = Math.random() * Math.PI * 2;
          
          cpuTargetPosition = {
            x: predictedPlayerX + Math.cos(randomAngle) * strategicDistance,
            y: predictedPlayerY + Math.sin(randomAngle) * strategicDistance
          };
        }
      }
      
      // Sun avoidance - enhanced to handle closer approaches more carefully
      const cpuToSun = {
        x: CANVAS_WIDTH / 2 - cpu.x,
        y: CANVAS_HEIGHT / 2 - cpu.y
      };
      const cpuDistanceToSun = Math.sqrt(cpuToSun.x * cpuToSun.x + cpuToSun.y * cpuToSun.y);
      
      // Handle CPU sun collision with respawn
      if (cpuDistanceToSun <= SUN_RADIUS) {
        const respawnDistance = 100;
        const respawnAngle = Math.atan2(cpuToSun.y, cpuToSun.x) + Math.PI;
        updatedCpu.x = CANVAS_WIDTH / 2 + Math.cos(respawnAngle) * respawnDistance;
        updatedCpu.y = CANVAS_HEIGHT / 2 + Math.sin(respawnAngle) * respawnDistance;
        updatedCpu.velocity = { x: 0, y: 0 };
      } else if (cpuDistanceToSun < 100) {
        // Enhanced sun avoidance when getting too close
        const angleToSun = Math.atan2(cpuToSun.y, cpuToSun.x);
        const escapeAngle = angleToSun + Math.PI / 2; // Tangential to orbit
        
        const sunAvoidanceX = CANVAS_WIDTH / 2 + Math.cos(escapeAngle) * 150;
        const sunAvoidanceY = CANVAS_HEIGHT / 2 + Math.sin(escapeAngle) * 150;
        
        cpuTargetPosition = { x: sunAvoidanceX, y: sunAvoidanceY };
      }
      
      // Calculate thrust and rotation to reach target
      const angleToTarget = Math.atan2(
        cpuTargetPosition.y - cpu.y,
        cpuTargetPosition.x - cpu.x
      );
      
      const angleToTurn = normalizeAngle(angleToTarget - updatedCpu.rotation);
      
      // Smart rotation control - more responsive at higher difficulty
      const turnAngleThreshold = 0.1 / (1 + difficulty * 0.2);
      updatedCpu.rotateLeft = angleToTurn < -turnAngleThreshold;
      updatedCpu.rotateRight = angleToTurn > turnAngleThreshold;
      
      // Smart thrust control - thrust when pointed approximately at target
      const thrustAngleThreshold = 0.3 / (1 + difficulty * 0.1);
      updatedCpu.thrust = Math.abs(angleToTurn) < thrustAngleThreshold;
      
      // Occasionally adjust speed to match optimal engagement distance
      const distanceToTarget = Math.sqrt(
        Math.pow(cpuTargetPosition.x - cpu.x, 2) + 
        Math.pow(cpuTargetPosition.y - cpu.y, 2)
      );
      
      // If very close to target, stop thrusting to maintain distance
      if (distanceToTarget < 50 && updatedCpu.thrust) {
        updatedCpu.thrust = false;
      }
      
      // Apply rotation - faster at higher difficulty
      if (updatedCpu.rotateLeft) {
        updatedCpu.rotation -= ROTATION_SPEED * (0.8 + difficulty * 0.08);
      }
      if (updatedCpu.rotateRight) {
        updatedCpu.rotation += ROTATION_SPEED * (0.8 + difficulty * 0.08);
      }
      
      // Apply thrust - more efficient at higher difficulty
      if (updatedCpu.thrust) {
        updatedCpu.velocity.x += Math.cos(updatedCpu.rotation) * THRUST_POWER * (0.9 + difficulty * 0.08);
        updatedCpu.velocity.y += Math.sin(updatedCpu.rotation) * THRUST_POWER * (0.9 + difficulty * 0.08);
      }
      
      // Apply sun gravity to CPU
      if (cpuDistanceToSun > SUN_RADIUS) {
        const gravityFactor = GRAVITY_STRENGTH / (cpuDistanceToSun * 0.1);
        updatedCpu.velocity.x += (cpuToSun.x / cpuDistanceToSun) * gravityFactor;
        updatedCpu.velocity.y += (cpuToSun.y / cpuDistanceToSun) * gravityFactor;
      }
      
      // Update CPU position
      updatedCpu.x += updatedCpu.velocity.x;
      updatedCpu.y += updatedCpu.velocity.y;
      
      // Wrap around edges
      if (updatedCpu.x > CANVAS_WIDTH) updatedCpu.x = 0;
      if (updatedCpu.x < 0) updatedCpu.x = CANVAS_WIDTH;
      if (updatedCpu.y > CANVAS_HEIGHT) updatedCpu.y = 0;
      if (updatedCpu.y < 0) updatedCpu.y = CANVAS_HEIGHT;
      
      setCpu(updatedCpu);
      
      // Update torpedoes
      const updatedTorpedoes = torpedoes.map(torpedo => {
        if (!torpedo.alive) return torpedo;
        
        const newTorpedo = { ...torpedo };
        newTorpedo.lifespan--;
        
        if (newTorpedo.lifespan <= 0) {
          newTorpedo.alive = false;
          return newTorpedo;
        }
        
        // Move torpedo
        newTorpedo.x += newTorpedo.velocity.x;
        newTorpedo.y += newTorpedo.velocity.y;
        
        // Apply sun gravity
        const torpedoToSun = {
          x: CANVAS_WIDTH / 2 - newTorpedo.x,
          y: CANVAS_HEIGHT / 2 - newTorpedo.y
        };
        const torpedoDistanceToSun = Math.sqrt(torpedoToSun.x * torpedoToSun.x + torpedoToSun.y * torpedoToSun.y);
        
        if (torpedoDistanceToSun > SUN_RADIUS) {
          const gravityFactor = GRAVITY_STRENGTH / (torpedoDistanceToSun * 0.1);
          newTorpedo.velocity.x += (torpedoToSun.x / torpedoDistanceToSun) * gravityFactor;
          newTorpedo.velocity.y += (torpedoToSun.y / torpedoDistanceToSun) * gravityFactor;
        } else {
          // Torpedoes are destroyed by the sun
          newTorpedo.alive = false;
          return newTorpedo;
        }
        
        // Wrap around edges
        if (newTorpedo.x > CANVAS_WIDTH) newTorpedo.x = 0;
        if (newTorpedo.x < 0) newTorpedo.x = CANVAS_WIDTH;
        if (newTorpedo.y > CANVAS_HEIGHT) newTorpedo.y = 0;
        if (newTorpedo.y < 0) newTorpedo.y = CANVAS_HEIGHT;
        
        // Check for collision with player
        if (newTorpedo.owner === 'cpu') {
          const dx = newTorpedo.x - player.x;
          const dy = newTorpedo.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < player.size) {
            newTorpedo.alive = false;
            
            // Different weapons deal different damage
            let pointsToAdd = 1; // Regular torpedo
            if (newTorpedo.isSpecial) pointsToAdd = 2; // Special weapon
            if (newTorpedo.isStandard) pointsToAdd = 1; // Standard weapon
            
            setCpu(prevCpu => {
              const newScore = prevCpu.score + pointsToAdd;
              
              // Check for game over
              if (newScore >= WINNING_SCORE) {
                setGameState(prev => ({ ...prev, gameOver: true, gameWon: false }));
              }
              
              return { ...prevCpu, score: newScore };
            });
            
            return newTorpedo;
          }
        }
        
        // Check for collision with CPU
        if (newTorpedo.owner === 'player') {
          const dx = newTorpedo.x - cpu.x;
          const dy = newTorpedo.y - cpu.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < cpu.size) {
            newTorpedo.alive = false;
            
            // Different weapons deal different damage
            let pointsToAdd = 1; // Regular torpedo
            if (newTorpedo.isSpecial) pointsToAdd = 2; // Special weapon
            if (newTorpedo.isStandard) pointsToAdd = 1; // Standard weapon
            
            setPlayer(prevPlayer => {
              const newScore = prevPlayer.score + pointsToAdd;
              
              // Check for win
              if (newScore >= WINNING_SCORE) {
                setGameState(prev => ({ ...prev, gameOver: true, gameWon: true }));
              }
              
              return { ...prevPlayer, score: newScore };
            });
            
            return newTorpedo;
          }
        }
        
        return newTorpedo;
      }).filter(torpedo => torpedo.alive);
      
      setTorpedoes(updatedTorpedoes);
      
      // Draw player ship
      drawShip(ctx, player);
      
      // Draw weapon charge indicators
      drawChargeIndicator(ctx, player.specialWeaponCharge, 20, 40, '#00aaff', 'SPECIAL');
      drawChargeIndicator(ctx, player.standardWeaponCharge, 20, 55, '#ffffff', 'STANDARD');
      
      // Draw CPU ship
      drawShip(ctx, cpu);
      
      // Draw CPU weapon charge indicators
      drawChargeIndicator(ctx, cpu.specialWeaponCharge, CANVAS_WIDTH - 120, 40, '#00aaff', 'SPECIAL');
      drawChargeIndicator(ctx, cpu.standardWeaponCharge, CANVAS_WIDTH - 120, 55, '#ffffff', 'STANDARD');
      
      // Draw torpedoes
      torpedoes.forEach(torpedo => {
        if (!torpedo.alive) return;
        
        let torpedoColor = torpedo.owner === 'player' ? '#00ff00' : '#ff0000'; // Regular torpedoes
        let torpedoSize = 3;
        
        if (torpedo.isSpecial) {
          torpedoColor = '#00aaff'; // Special blue torpedo
          torpedoSize = 5;
        } else if (torpedo.isStandard) {
          torpedoColor = torpedo.owner === 'player' ? '#ffffff' : '#ffcccc'; // Standard white/light red torpedo
          torpedoSize = 4;
        }
        
        ctx.fillStyle = torpedoColor;
        ctx.beginPath();
        ctx.arc(torpedo.x, torpedo.y, torpedoSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw scores
      ctx.font = '20px monospace';
      ctx.fillStyle = '#00ff00';
      ctx.fillText(`Player: ${player.score}`, 20, 30);
      ctx.fillStyle = '#ff0000';
      ctx.fillText(`CPU: ${cpu.score}`, CANVAS_WIDTH - 120, 30);
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    const drawChargeIndicator = (ctx: CanvasRenderingContext2D, charge: number, x: number, y: number, color: string, label: string) => {
      ctx.fillStyle = '#333';
      ctx.fillRect(x, y, 100, 10);
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, charge, 10);
      
      if (charge >= 100) {
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText('READY', x + 35, y + 8);
      } else {
        ctx.fillStyle = '#999';
        ctx.font = '8px monospace';
        ctx.fillText(label, x + 5, y + 8);
      }
    };
    
    const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.rotation);
      
      // Draw ship body
      ctx.fillStyle = ship.color;
      ctx.beginPath();
      ctx.moveTo(ship.size, 0);
      ctx.lineTo(-ship.size / 2, -ship.size / 2);
      ctx.lineTo(-ship.size / 2, ship.size / 2);
      ctx.closePath();
      ctx.fill();
      
      // Draw special weapon firing effect
      if (ship.firingSpecial) {
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        ctx.arc(ship.size + 10, 0, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw standard weapon firing effect
      if (ship.firingStandard) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ship.size + 8, 0, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw thrust if active
      if (ship.thrust) {
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.moveTo(-ship.size / 2, 0);
        ctx.lineTo(-ship.size - 5, -ship.size / 4);
        ctx.lineTo(-ship.size - 5, ship.size / 4);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    const normalizeAngle = (angle: number) => {
      while (angle > Math.PI) angle -= Math.PI * 2;
      while (angle < -Math.PI) angle += Math.PI * 2;
      return angle;
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.gameStarted, gameState.gameOver, player, cpu, torpedoes, lastPlayerFire, lastCpuFire]);
  
  const handleContinue = () => {
    onGameComplete();
  };
  
  const handlePlayAgain = () => {
    onPlayAgain(gameState.gameWon);
    setGameState({ gameStarted: true, gameOver: false, gameWon: false, score: 0 });
    setPlayer(prev => ({ 
      ...prev, 
      score: 0, 
      x: 200, 
      y: 300, 
      velocity: { x: 0, y: 0 },
      specialWeaponCharge: 100,
      standardWeaponCharge: 100
    }));
    setCpu(prev => ({ 
      ...prev, 
      score: 0, 
      x: 600, 
      y: 300, 
      velocity: { x: 0, y: 0 },
      specialWeaponCharge: 100,
      standardWeaponCharge: 100
    }));
    setTorpedoes([]);
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-black">
      <h2 className="text-terminal-green text-xl mb-2 font-mono">SPACEWAR!</h2>
      <div className="border-2 border-terminal-green relative">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="bg-black"
        />
        
        {gameState.gameOver && (
          <GameResult
            gameWon={gameState.gameWon}
            onContinue={handleContinue}
            onPlayAgain={handlePlayAgain}
            alwaysShowContinue={gameState.gameWon}
          />
        )}
      </div>
      
      {isMobile && !gameState.gameOver && (
        <div className="mt-4 flex flex-col items-center">
          <div className="flex gap-8 mb-4">
            <button
              onTouchStart={() => {
                if (player.standardWeaponCharge >= 100) {
                  fireStandardWeapon('player', player);
                  setPlayer(prev => ({ ...prev, standardWeaponCharge: 0, firingStandard: true }));
                  setTimeout(() => {
                    setPlayer(prev => ({ ...prev, firingStandard: false }));
                  }, 300);
                }
              }}
              className={`${player.standardWeaponCharge >= 100 ? 'bg-white' : 'bg-gray-500'} text-black p-3 rounded-full font-bold`}
            >
              STANDARD
            </button>
            <button
              onTouchStart={() => {
                if (player.specialWeaponCharge >= 100) {
                  fireSpecialWeapon('player', player);
                  setPlayer(prev => ({ ...prev, specialWeaponCharge: 0, firingSpecial: true }));
                  setTimeout(() => {
                    setPlayer(prev => ({ ...prev, firingSpecial: false }));
                  }, 500);
                }
              }}
              className={`${player.specialWeaponCharge >= 100 ? 'bg-blue-500' : 'bg-gray-500'} text-black p-3 rounded-full font-bold`}
            >
              SPECIAL
            </button>
          </div>
          <button
            onTouchStart={() => setPlayer(prev => ({ ...prev, thrust: true }))}
            onTouchEnd={() => setPlayer(prev => ({ ...prev, thrust: false }))}
            className="bg-terminal-green text-black p-3 rounded-full mb-2 font-bold"
          >
            THRUST
          </button>
          <div className="flex gap-8">
            <button
              onTouchStart={() => setPlayer(prev => ({ ...prev, rotateLeft: true }))}
              onTouchEnd={() => setPlayer(prev => ({ ...prev, rotateLeft: false }))}
              className="bg-terminal-green text-black p-3 rounded-full font-bold"
            >
              ← TURN
            </button>
            <button
              onTouchStart={() => setPlayer(prev => ({ ...prev, rotateRight: true }))}
              onTouchEnd={() => setPlayer(prev => ({ ...prev, rotateRight: false }))}
              className="bg-terminal-green text-black p-3 rounded-full font-bold"
            >
              TURN →
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm text-terminal-green">
        {!isMobile ? "Controls: Arrow Keys to move, SPACE for standard weapon, B for special weapon" : "Use on-screen buttons to control your ship"}
      </div>
    </div>
  );
};

export default SpacewarGame;
