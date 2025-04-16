
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
}

interface Torpedo {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  alive: boolean;
  owner: 'player' | 'cpu';
  lifespan: number;
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
    color: '#00ff00'
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
    color: '#ff0000'
  });
  
  const [torpedoes, setTorpedoes] = useState<Torpedo[]>([]);
  const [lastPlayerFire, setLastPlayerFire] = useState(0);
  const [lastCpuFire, setLastCpuFire] = useState(0);
  
  const FIRE_RATE = 400; // ms between shots
  const WINNING_SCORE = 20;
  
  // Game constants
  const CANVAS_WIDTH = Math.min(800, window.innerWidth - 20);
  const CANVAS_HEIGHT = 600;
  const SUN_RADIUS = 30;
  const GRAVITY_STRENGTH = 0.15;
  const ROTATION_SPEED = 0.1;
  const THRUST_POWER = 0.2;
  const TORPEDO_SPEED = 6;
  const TORPEDO_LIFESPAN = 60; // frames
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
  }, [gameState.gameOver]);
  
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
      color: '#00ff00'
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
      color: '#ff0000'
    });
    
    setTorpedoes([]);
  }, []);
  
  // Main game loop
  useEffect(() => {
    if (!canvasRef.current || !gameState.gameStarted || gameState.gameOver) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    
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
      
      // Check for autofire
      const now = Date.now();
      if (now - lastPlayerFire > FIRE_RATE) {
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
      
      if (playerDistanceToSun > SUN_RADIUS) {
        const gravityFactor = GRAVITY_STRENGTH / (playerDistanceToSun * 0.1);
        updatedPlayer.velocity.x += (playerToSun.x / playerDistanceToSun) * gravityFactor;
        updatedPlayer.velocity.y += (playerToSun.y / playerDistanceToSun) * gravityFactor;
      } else {
        // Collision with sun - reset player
        updatedPlayer.x = Math.random() * CANVAS_WIDTH;
        updatedPlayer.y = Math.random() * CANVAS_HEIGHT;
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
      
      // Update CPU ship with AI
      const updatedCpu = { ...cpu };
      
      // CPU AI logic
      // 1. Try to avoid the sun
      const cpuToSun = {
        x: CANVAS_WIDTH / 2 - cpu.x,
        y: CANVAS_HEIGHT / 2 - cpu.y
      };
      const cpuDistanceToSun = Math.sqrt(cpuToSun.x * cpuToSun.x + cpuToSun.y * cpuToSun.y);
      
      // Determine target based on difficulty
      const targetPlayer = Math.random() < (0.6 + DIFFICULTY_MODIFIER);
      
      if (cpuDistanceToSun < 200) {
        // Avoid sun by rotating away from it
        const angleToSun = Math.atan2(cpuToSun.y, cpuToSun.x);
        const oppositeAngle = angleToSun + Math.PI;
        const angleToTurn = normalizeAngle(oppositeAngle - updatedCpu.rotation);
        
        if (angleToTurn > 0.1) updatedCpu.rotateRight = true;
        else if (angleToTurn < -0.1) updatedCpu.rotateLeft = true;
        else {
          updatedCpu.rotateRight = false;
          updatedCpu.rotateLeft = false;
        }
        
        // Apply thrust to move away
        updatedCpu.thrust = true;
      } else if (targetPlayer) {
        // Target player by rotating towards them
        const angleToPlayer = Math.atan2(player.y - cpu.y, player.x - cpu.x);
        const angleToTurn = normalizeAngle(angleToPlayer - updatedCpu.rotation);
        
        if (angleToTurn > 0.1) updatedCpu.rotateRight = true;
        else if (angleToTurn < -0.1) updatedCpu.rotateLeft = true;
        else {
          updatedCpu.rotateRight = false;
          updatedCpu.rotateLeft = false;
          // Only thrust when properly aligned
          updatedCpu.thrust = Math.abs(angleToTurn) < 0.3;
        }
      } else {
        // Random movement
        if (Math.random() < 0.02) updatedCpu.rotateLeft = !updatedCpu.rotateLeft;
        if (Math.random() < 0.02) updatedCpu.rotateRight = !updatedCpu.rotateRight;
        if (Math.random() < 0.05) updatedCpu.thrust = !updatedCpu.thrust;
      }
      
      // Check for autofire
      if (now - lastCpuFire > FIRE_RATE) {
        fireTorpedo('cpu', cpu);
        setLastCpuFire(now);
      }
      
      // Apply rotation
      if (updatedCpu.rotateLeft) {
        updatedCpu.rotation -= ROTATION_SPEED * 0.8;
      }
      if (updatedCpu.rotateRight) {
        updatedCpu.rotation += ROTATION_SPEED * 0.8;
      }
      
      // Apply thrust
      if (updatedCpu.thrust) {
        updatedCpu.velocity.x += Math.cos(updatedCpu.rotation) * THRUST_POWER * 0.9;
        updatedCpu.velocity.y += Math.sin(updatedCpu.rotation) * THRUST_POWER * 0.9;
      }
      
      // Apply sun gravity to CPU
      if (cpuDistanceToSun > SUN_RADIUS) {
        const gravityFactor = GRAVITY_STRENGTH / (cpuDistanceToSun * 0.1);
        updatedCpu.velocity.x += (cpuToSun.x / cpuDistanceToSun) * gravityFactor;
        updatedCpu.velocity.y += (cpuToSun.y / cpuDistanceToSun) * gravityFactor;
      } else {
        // Collision with sun - reset CPU
        updatedCpu.x = Math.random() * CANVAS_WIDTH;
        updatedCpu.y = Math.random() * CANVAS_HEIGHT;
        updatedCpu.velocity = { x: 0, y: 0 };
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
          // Collision with sun
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
            setCpu(prevCpu => ({ ...prevCpu, score: prevCpu.score + 1 }));
            
            // Check for game over
            if (cpu.score + 1 >= WINNING_SCORE) {
              setGameState(prev => ({ ...prev, gameOver: true, gameWon: false }));
              
              // Auto-restart after a delay when CPU wins
              setTimeout(() => {
                handlePlayAgain();
              }, 2000);
            }
            
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
            setPlayer(prevPlayer => ({ ...prevPlayer, score: prevPlayer.score + 1 }));
            
            // Check for win
            if (player.score + 1 >= WINNING_SCORE) {
              setGameState(prev => ({ ...prev, gameOver: true, gameWon: true }));
            }
            
            return newTorpedo;
          }
        }
        
        return newTorpedo;
      }).filter(torpedo => torpedo.alive);
      
      setTorpedoes(updatedTorpedoes);
      
      // Draw player ship
      drawShip(ctx, player);
      
      // Draw CPU ship
      drawShip(ctx, cpu);
      
      // Draw torpedoes
      torpedoes.forEach(torpedo => {
        if (!torpedo.alive) return;
        
        ctx.fillStyle = torpedo.owner === 'player' ? '#00ff00' : '#ff0000';
        ctx.beginPath();
        ctx.arc(torpedo.x, torpedo.y, 3, 0, Math.PI * 2);
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
        lifespan: TORPEDO_LIFESPAN
      };
      
      setTorpedoes(prev => [...prev, torpedo]);
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
    setPlayer(prev => ({ ...prev, score: 0, x: 200, y: 300, velocity: { x: 0, y: 0 } }));
    setCpu(prev => ({ ...prev, score: 0, x: 600, y: 300, velocity: { x: 0, y: 0 } }));
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
        {!isMobile ? "Controls: Arrow Keys to move" : "Use on-screen buttons to control your ship"}
      </div>
    </div>
  );
};

export default SpacewarGame;
