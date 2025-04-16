
import { useCallback, useEffect, useState, RefObject } from 'react';

interface SpaceWarGameProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  difficulty?: number;
  onWin: () => void;
  onLose: () => void;
}

// Game settings
const SHIP_SIZE = 15;
const BULLET_SIZE = 3;
const BULLET_SPEED = 5;
const SUN_SIZE = 30;
const GRAVITY_STRENGTH = 0.05;
const MAX_BULLETS = 5;
const BULLET_COOLDOWN = 400; // ms
const WIN_SCORE = 20;

// Game entities
interface Ship {
  x: number;
  y: number;
  angle: number;
  velocity: { x: number; y: number };
  rotation: number;
  thrust: number;
  bullets: Bullet[];
  lastFired: number;
  score: number;
}

interface Bullet {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  alive: boolean;
  lifeTime: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
}

export const useSpaceWarGame = ({
  canvasRef,
  containerRef,
  difficulty = 1,
  onWin,
  onLose
}: SpaceWarGameProps) => {
  // Game state
  const [player, setPlayer] = useState<Ship>({
    x: 0,
    y: 0,
    angle: 0,
    velocity: { x: 0, y: 0 },
    rotation: 0,
    thrust: 0,
    bullets: [],
    lastFired: 0,
    score: 0
  });
  
  const [cpu, setCpu] = useState<Ship>({
    x: 0,
    y: 0,
    angle: Math.PI,
    velocity: { x: 0, y: 0 },
    rotation: 0,
    thrust: 0,
    bullets: [],
    lastFired: 0,
    score: 0
  });
  
  const [sun, setSun] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [lastTime, setLastTime] = useState(0);
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Initialize the game
  const initializeGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size based on container
    const updateCanvasSize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      canvas.width = Math.min(containerWidth, 800);
      canvas.height = Math.min(containerHeight, 600);
      
      setCanvasSize({
        width: canvas.width,
        height: canvas.height
      });
    };
    
    updateCanvasSize();
    
    // Initialize player and CPU positions
    setPlayer(prev => ({
      ...prev,
      x: canvasSize.width * 0.25,
      y: canvasSize.height / 2,
      angle: 0,
      velocity: { x: 0, y: 0 },
      rotation: 0,
      thrust: 0,
      bullets: [],
      lastFired: 0,
      score: 0
    }));
    
    setCpu(prev => ({
      ...prev,
      x: canvasSize.width * 0.75,
      y: canvasSize.height / 2,
      angle: Math.PI,
      velocity: { x: 0, y: 0 },
      rotation: 0,
      thrust: 0,
      bullets: [],
      lastFired: 0,
      score: 0
    }));
    
    // Set sun in the center
    setSun({
      x: canvasSize.width / 2,
      y: canvasSize.height / 2
    });
    
    // Create stars
    const newStars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        x: Math.random() * canvasSize.width,
        y: Math.random() * canvasSize.height,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.01 + 0.005
      });
    }
    setStars(newStars);
    
    // Add event listeners
    window.addEventListener('resize', updateCanvasSize);
    
    // Keyboard controls for WASD
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game
    setIsRunning(true);
    setIsGameOver(false);
    setPlayerWon(false);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvasRef, containerRef, canvasSize]);

  // Handle mobile controls
  const handleMobileControl = useCallback((direction: 'up' | 'left' | 'right' | 'down', pressed: boolean) => {
    // Map mobile controls to WASD
    const keyMap = {
      up: 'w',
      left: 'a',
      right: 'd',
      down: 's'
    };
    
    setKeys(prev => ({
      ...prev,
      [keyMap[direction]]: pressed
    }));
  }, []);

  // Fire a bullet from a ship
  const fireBullet = useCallback((ship: Ship, isPlayer: boolean): Ship => {
    const currentTime = Date.now();
    
    if (currentTime - ship.lastFired < BULLET_COOLDOWN || ship.bullets.length >= MAX_BULLETS) {
      return ship;
    }
    
    const angle = ship.angle;
    const bulletVelocityX = Math.cos(angle) * BULLET_SPEED + ship.velocity.x * 0.5;
    const bulletVelocityY = Math.sin(angle) * BULLET_SPEED + ship.velocity.y * 0.5;
    
    const newBullet: Bullet = {
      x: ship.x + Math.cos(angle) * (SHIP_SIZE + 5),
      y: ship.y + Math.sin(angle) * (SHIP_SIZE + 5),
      velocity: { x: bulletVelocityX, y: bulletVelocityY },
      alive: true,
      lifeTime: 100
    };
    
    return {
      ...ship,
      bullets: [...ship.bullets, newBullet],
      lastFired: currentTime
    };
  }, []);

  // CPU AI logic
  const updateCpuAI = useCallback((cpu: Ship, player: Ship, deltaTime: number): Ship => {
    // Difficulty affects CPU accuracy and aggression
    const accuracyModifier = Math.min(difficulty * 0.3, 0.9);
    const aggressionModifier = Math.min(difficulty * 0.2, 0.8);
    
    // Calculate angle to player with intentional inaccuracy based on difficulty
    const dx = player.x - cpu.x;
    const dy = player.y - cpu.y;
    const angleToPlayer = Math.atan2(dy, dx);
    
    // Add some inaccuracy based on distance and difficulty
    const distance = Math.sqrt(dx * dx + dy * dy);
    const inaccuracy = (1 - accuracyModifier) * (Math.random() * 0.5 - 0.25) * (400 / Math.max(distance, 100));
    const targetAngle = angleToPlayer + inaccuracy;
    
    // Calculate difference between current angle and target angle
    let angleDiff = targetAngle - cpu.angle;
    
    // Normalize angle difference to be between -PI and PI
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    
    // Apply rotation based on angle difference
    let rotation = 0;
    if (angleDiff > 0.1) rotation = 0.05;
    else if (angleDiff < -0.1) rotation = -0.05;
    
    // Apply thrust sometimes, more likely when aligned with player
    const alignedWithPlayer = Math.abs(angleDiff) < 0.5;
    const shouldThrust = Math.random() < (alignedWithPlayer ? 0.03 + aggressionModifier : 0.01);
    const thrust = shouldThrust ? 0.1 + aggressionModifier * 0.1 : 0;
    
    // Always try to fire when CPU can see the player
    const canSeePlayer = Math.abs(angleDiff) < 0.4 && Math.random() < (0.1 + aggressionModifier);
    let updatedCpu = cpu;
    
    if (canSeePlayer) {
      updatedCpu = fireBullet(cpu, false);
    }
    
    return {
      ...updatedCpu,
      rotation,
      thrust
    };
  }, [difficulty, fireBullet]);

  // Update game logic
  const updateGameState = useCallback((deltaTime: number) => {
    if (!isRunning || isGameOver) return;
    
    // Handle player input for WASD controls
    const playerRotation = keys.a ? -0.1 : keys.d ? 0.1 : 0;
    const playerThrust = keys.w ? 0.1 : 0;
    
    // Auto-fire for player
    let updatedPlayer = { ...player, rotation: playerRotation, thrust: playerThrust };
    if (Math.random() < 0.1) { // 10% chance to fire each frame
      updatedPlayer = fireBullet(updatedPlayer, true);
    }
    
    // Update CPU AI
    const updatedCpu = updateCpuAI(cpu, player, deltaTime);
    
    // Update ships
    const newPlayer = updateShip(updatedPlayer, sun, deltaTime, true);
    const newCpu = updateShip(updatedCpu, sun, deltaTime, false);
    
    // Check collisions
    const { playerHit, cpuHit } = checkCollisions(newPlayer, newCpu, sun);
    
    // Update scores and check win conditions
    let playerScore = player.score;
    let cpuScore = cpu.score;
    
    if (cpuHit) {
      playerScore += 1;
      if (playerScore >= WIN_SCORE) {
        setIsGameOver(true);
        setPlayerWon(true);
        onWin();
        return;
      }
    }
    
    if (playerHit) {
      cpuScore += 1;
      if (cpuScore >= WIN_SCORE) {
        setIsGameOver(true);
        setPlayerWon(false);
        onLose();
        return;
      }
    }
    
    // Update stars' twinkle effect
    const newStars = stars.map(star => ({
      ...star,
      brightness: 0.5 + 0.5 * Math.sin(Date.now() * star.twinkleSpeed)
    }));
    
    // Update game state
    setPlayer({
      ...newPlayer,
      score: playerScore
    });
    
    setCpu({
      ...newCpu,
      score: cpuScore
    });
    
    setStars(newStars);
  }, [isRunning, isGameOver, player, cpu, sun, stars, keys, updateCpuAI, fireBullet, onWin, onLose]);

  // Update ship position based on physics
  const updateShip = useCallback((ship: Ship, sun: { x: number, y: number }, deltaTime: number, isPlayer: boolean): Ship => {
    // Apply rotation
    const newAngle = (ship.angle + ship.rotation) % (Math.PI * 2);
    
    // Apply thrust
    const thrustX = Math.cos(newAngle) * ship.thrust;
    const thrustY = Math.sin(newAngle) * ship.thrust;
    
    // Calculate gravity effect from the sun
    const dx = sun.x - ship.x;
    const dy = sun.y - ship.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);
    
    // Apply gravity (stronger when closer)
    const gravityStrength = GRAVITY_STRENGTH / Math.max(distance / 100, 1);
    const gravityX = dx / distance * gravityStrength;
    const gravityY = dy / distance * gravityStrength;
    
    // Update velocity
    const newVelocityX = ship.velocity.x + (thrustX + gravityX) * deltaTime;
    const newVelocityY = ship.velocity.y + (thrustY + gravityY) * deltaTime;
    
    // Apply drag (slight resistance)
    const drag = 0.995;
    const finalVelocityX = newVelocityX * drag;
    const finalVelocityY = newVelocityY * drag;
    
    // Update position
    let newX = ship.x + finalVelocityX * deltaTime;
    let newY = ship.y + finalVelocityY * deltaTime;
    
    // Keep ships in bounds with wraparound
    if (newX < 0) newX += canvasSize.width;
    if (newX > canvasSize.width) newX -= canvasSize.width;
    if (newY < 0) newY += canvasSize.height;
    if (newY > canvasSize.height) newY -= canvasSize.height;
    
    // Update bullets
    const newBullets = ship.bullets.map(bullet => {
      // Apply gravity to bullets too
      const bulletDx = sun.x - bullet.x;
      const bulletDy = sun.y - bullet.y;
      const bulletDistance = Math.sqrt(bulletDx * bulletDx + bulletDy * bulletDy);
      
      const bulletGravityStrength = GRAVITY_STRENGTH * 0.1 / Math.max(bulletDistance / 100, 1);
      const bulletGravityX = bulletDx / bulletDistance * bulletGravityStrength;
      const bulletGravityY = bulletDy / bulletDistance * bulletGravityStrength;
      
      // Update bullet velocity with gravity
      const newBulletVelocityX = bullet.velocity.x + bulletGravityX * deltaTime;
      const newBulletVelocityY = bullet.velocity.y + bulletGravityY * deltaTime;
      
      // Update bullet position
      let newBulletX = bullet.x + newBulletVelocityX * deltaTime;
      let newBulletY = bullet.y + newBulletVelocityY * deltaTime;
      
      // Bullet wraparound
      if (newBulletX < 0) newBulletX += canvasSize.width;
      if (newBulletX > canvasSize.width) newBulletX -= canvasSize.width;
      if (newBulletY < 0) newBulletY += canvasSize.height;
      if (newBulletY > canvasSize.height) newBulletY -= canvasSize.height;
      
      return {
        ...bullet,
        x: newBulletX,
        y: newBulletY,
        velocity: { x: newBulletVelocityX, y: newBulletVelocityY },
        lifeTime: bullet.lifeTime - 1,
        alive: bullet.lifeTime > 0
      };
    }).filter(bullet => bullet.alive);
    
    return {
      ...ship,
      x: newX,
      y: newY,
      angle: newAngle,
      velocity: { x: finalVelocityX, y: finalVelocityY },
      bullets: newBullets
    };
  }, [canvasSize]);

  // Check for collisions between ships, bullets, and the sun
  const checkCollisions = useCallback((player: Ship, cpu: Ship, sun: { x: number, y: number }) => {
    let playerHit = false;
    let cpuHit = false;
    
    // Check player bullets hitting CPU
    player.bullets.forEach(bullet => {
      const dx = bullet.x - cpu.x;
      const dy = bullet.y - cpu.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < SHIP_SIZE + BULLET_SIZE) {
        cpuHit = true;
      }
    });
    
    // Check CPU bullets hitting player
    cpu.bullets.forEach(bullet => {
      const dx = bullet.x - player.x;
      const dy = bullet.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < SHIP_SIZE + BULLET_SIZE) {
        playerHit = true;
      }
    });
    
    // Check ship-sun collisions (optional, could destroy ship or bounce)
    const playerSunDx = player.x - sun.x;
    const playerSunDy = player.y - sun.y;
    const playerSunDistance = Math.sqrt(playerSunDx * playerSunDx + playerSunDy * playerSunDy);
    
    if (playerSunDistance < SUN_SIZE + SHIP_SIZE * 0.7) {
      playerHit = true;
    }
    
    const cpuSunDx = cpu.x - sun.x;
    const cpuSunDy = cpu.y - sun.y;
    const cpuSunDistance = Math.sqrt(cpuSunDx * cpuSunDx + cpuSunDy * cpuSunDy);
    
    if (cpuSunDistance < SUN_SIZE + SHIP_SIZE * 0.7) {
      cpuHit = true;
    }
    
    return { playerHit, cpuHit };
  }, []);

  // Rendering function
  useEffect(() => {
    if (!canvasRef.current || !isRunning) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    
    const render = (timestamp: number) => {
      if (!isRunning) return;
      
      // Calculate delta time for smooth animation
      const deltaTime = timestamp - lastTime;
      const normalizedDeltaTime = Math.min(deltaTime, 100) / 16; // Cap at ~60fps
      
      // Update game state
      updateGameState(normalizedDeltaTime);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw starfield
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw sun with gradient
      const sunGradient = ctx.createRadialGradient(
        sun.x, sun.y, SUN_SIZE * 0.3,
        sun.x, sun.y, SUN_SIZE * 1.2
      );
      sunGradient.addColorStop(0, 'rgba(255, 200, 0, 1)');
      sunGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.8)');
      sunGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, SUN_SIZE * 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner sun
      ctx.fillStyle = 'rgba(255, 230, 100, 0.9)';
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, SUN_SIZE * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw player ship
      drawShip(ctx, player, true);
      
      // Draw CPU ship
      drawShip(ctx, cpu, false);
      
      // Draw bullets
      drawBullets(ctx, player.bullets, 'rgba(0, 255, 0, 0.8)');
      drawBullets(ctx, cpu.bullets, 'rgba(255, 0, 0, 0.8)');
      
      // Save timestamp
      setLastTime(timestamp);
      
      // Request next frame
      animationId = requestAnimationFrame(render);
    };
    
    animationId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [canvasRef, isRunning, player, cpu, sun, stars, updateGameState, lastTime, canvasSize]);

  // Draw a ship
  const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship, isPlayer: boolean) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Ship color
    ctx.fillStyle = isPlayer ? '#00ff00' : '#ff0000';
    ctx.strokeStyle = isPlayer ? '#00aa00' : '#aa0000';
    ctx.lineWidth = 1.5;
    
    // Draw ship body (triangle)
    ctx.beginPath();
    ctx.moveTo(SHIP_SIZE, 0);
    ctx.lineTo(-SHIP_SIZE / 2, SHIP_SIZE / 2);
    ctx.lineTo(-SHIP_SIZE / 2, -SHIP_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw engine thrust if thrusting
    if (ship.thrust > 0) {
      ctx.fillStyle = isPlayer ? 'rgba(0, 255, 255, 0.7)' : 'rgba(255, 255, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(-SHIP_SIZE / 2, 0);
      ctx.lineTo(-SHIP_SIZE - Math.random() * 10, SHIP_SIZE / 3);
      ctx.lineTo(-SHIP_SIZE - Math.random() * 15, 0);
      ctx.lineTo(-SHIP_SIZE - Math.random() * 10, -SHIP_SIZE / 3);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  };

  // Draw bullets
  const drawBullets = (ctx: CanvasRenderingContext2D, bullets: Bullet[], color: string) => {
    bullets.forEach(bullet => {
      // Create a gradient for glowing bullets
      const gradient = ctx.createRadialGradient(
        bullet.x, bullet.y, 0,
        bullet.x, bullet.y, BULLET_SIZE * 2
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, BULLET_SIZE * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Solid bullet center
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, BULLET_SIZE * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Game control functions
  const handleStartGame = useCallback(() => {
    setIsRunning(true);
    setIsGameOver(false);
    initializeGame();
  }, [initializeGame]);

  const handleRestartGame = useCallback(() => {
    setIsRunning(true);
    setIsGameOver(false);
    setPlayerWon(false);
    
    // Reset scores
    setPlayer(prev => ({ ...prev, score: 0 }));
    setCpu(prev => ({ ...prev, score: 0 }));
    
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    // Initialize game on mount
    const cleanup = initializeGame();
    
    return () => {
      if (cleanup) cleanup();
      setIsRunning(false);
    };
  }, [initializeGame]);

  return {
    playerScore: player.score,
    cpuScore: cpu.score,
    isRunning,
    isGameOver,
    playerWon,
    handleStartGame,
    handleRestartGame,
    handleMobileControl
  };
};

export default useSpaceWarGame;
