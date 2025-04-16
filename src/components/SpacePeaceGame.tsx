import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { useIsMobile } from '../hooks/use-mobile';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';

interface Ship {
  x: number;
  y: number;
  angle: number;
  velocity: { x: number; y: number };
  thrust: boolean;
  cooldown: number;
  projectiles: Projectile[];
  radius: number;
  hitCount: number;
}

interface Projectile {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  life: number;
  active: boolean;
}

interface Sun {
  x: number;
  y: number;
  radius: number;
}

const SpacePeaceGame: React.FC<BaseGameProps> = ({ 
  onGameComplete, 
  onPlayAgain, 
  difficulty = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const isMobile = useIsMobile();
  
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  const gameAreaWidth = Math.min(width - 40, 600);
  const gameAreaHeight = Math.min(height - 200, 600);
  
  const [playerShip, setPlayerShip] = useState<Ship>({
    x: gameAreaWidth * 0.25,
    y: gameAreaHeight / 2,
    angle: 0,
    velocity: { x: 0, y: 0 },
    thrust: false,
    cooldown: 0,
    projectiles: [],
    radius: 10,
    hitCount: 0
  });
  
  const [cpuShip, setCpuShip] = useState<Ship>({
    x: gameAreaWidth * 0.75,
    y: gameAreaHeight / 2,
    angle: Math.PI,
    velocity: { x: 0, y: 0 },
    thrust: false,
    cooldown: 0,
    projectiles: [],
    radius: 10,
    hitCount: 0
  });
  
  const [sun, setSun] = useState<Sun>({
    x: gameAreaWidth / 2,
    y: gameAreaHeight / 2,
    radius: 20
  });
  
  const [keys, setKeys] = useState({
    left: false,
    right: false
  });
  
  const WINNING_SCORE = 20;
  const projectileLifetime = 100;
  const shipThrustPower = 0.1;
  const turnSpeed = 0.08;
  const projectileSpeed = 5;
  const fireRate = 30;
  const gravitationalConstant = 0.5;
  const friction = 0.98;
  
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    let animationFrameId: number;
    
    const render = () => {
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.beginPath();
      context.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
      context.fillStyle = 'yellow';
      context.fill();
      
      updateGameState();
      
      drawShip(context, playerShip, '#D6BCFA');
      drawShip(context, cpuShip, '#F97316');
      
      drawProjectiles(context, playerShip.projectiles, '#D6BCFA');
      drawProjectiles(context, cpuShip.projectiles, '#F97316');
      
      if (playerShip.hitCount >= WINNING_SCORE) {
        setGameOver(true);
        setGameWon(true);
      } else if (cpuShip.hitCount >= WINNING_SCORE) {
        setGameOver(true);
        setGameWon(false);
      }
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, playerShip.hitCount, cpuShip.hitCount]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setKeys(prev => ({ ...prev, left: true }));
      } else if (e.key === 'ArrowRight') {
        setKeys(prev => ({ ...prev, right: true }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setKeys(prev => ({ ...prev, left: false }));
      } else if (e.key === 'ArrowRight') {
        setKeys(prev => ({ ...prev, right: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    if (!showInstructions) {
      setGameStarted(true);
    }
  }, [showInstructions]);
  
  const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship, color: string) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-8, 8);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-8, -8);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    if (ship.thrust) {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-15, 4);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-15, -4);
      ctx.closePath();
      ctx.fillStyle = 'orange';
      ctx.fill();
    }
    
    ctx.restore();
  };
  
  const drawProjectiles = (ctx: CanvasRenderingContext2D, projectiles: Projectile[], color: string) => {
    projectiles.forEach(projectile => {
      if (!projectile.active) return;
      
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  };
  
  const updateGameState = () => {
    updateShip(playerShip, setPlayerShip, keys);
    const cpuKeys = getAIInput();
    updateShip(cpuShip, setCpuShip, cpuKeys);
    checkProjectileHits();
  };
  
  const updateShip = (ship: Ship, setShipState: React.Dispatch<React.SetStateAction<Ship>>, controls: {left: boolean, right: boolean}) => {
    let newShip = { ...ship };
    
    if (controls.left) {
      newShip.angle -= turnSpeed;
    }
    if (controls.right) {
      newShip.angle += turnSpeed;
    }
    
    newShip.thrust = true;
    
    if (newShip.thrust) {
      newShip.velocity.x += Math.cos(newShip.angle) * shipThrustPower;
      newShip.velocity.y += Math.sin(newShip.angle) * shipThrustPower;
    }
    
    const dx = sun.x - newShip.x;
    const dy = sun.y - newShip.y;
    const distSq = dx * dx + dy * dy;
    const distance = Math.sqrt(distSq);
    
    if (distance > sun.radius) {
      const force = gravitationalConstant / distSq;
      const angle = Math.atan2(dy, dx);
      
      newShip.velocity.x += Math.cos(angle) * force;
      newShip.velocity.y += Math.sin(angle) * force;
    }
    
    newShip.velocity.x *= friction;
    newShip.velocity.y *= friction;
    
    newShip.x += newShip.velocity.x;
    newShip.y += newShip.velocity.y;
    
    if (newShip.x > gameAreaWidth) newShip.x = 0;
    if (newShip.x < 0) newShip.x = gameAreaWidth;
    if (newShip.y > gameAreaHeight) newShip.y = 0;
    if (newShip.y < 0) newShip.y = gameAreaHeight;
    
    const updatedProjectiles = newShip.projectiles
      .map(proj => {
        if (!proj.active) return proj;
        
        const newProj = { ...proj };
        newProj.life--;
        
        if (newProj.life <= 0) {
          newProj.active = false;
          return newProj;
        }
        
        newProj.x += newProj.velocity.x;
        newProj.y += newProj.velocity.y;
        
        const dx = sun.x - newProj.x;
        const dy = sun.y - newProj.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq > sun.radius * sun.radius) {
          const force = gravitationalConstant / distSq * 0.5;
          const angle = Math.atan2(dy, dx);
          
          newProj.velocity.x += Math.cos(angle) * force;
          newProj.velocity.y += Math.sin(angle) * force;
        }
        
        if (newProj.x > gameAreaWidth) newProj.x = 0;
        if (newProj.x < 0) newProj.x = gameAreaWidth;
        if (newProj.y > gameAreaHeight) newProj.y = 0;
        if (newProj.y < 0) newProj.y = gameAreaHeight;
        
        return newProj;
      })
      .filter(proj => proj.life > 0 || !proj.active);
    
    newShip.projectiles = updatedProjectiles;
    
    if (newShip.cooldown > 0) {
      newShip.cooldown--;
    } else {
      fireProjectile(newShip);
      newShip.cooldown = fireRate;
    }
    
    setShipState(newShip);
  };
  
  const getAIInput = () => {
    const aiKeys = { left: false, right: false };
    
    const dx = playerShip.x - cpuShip.x;
    const dy = playerShip.y - cpuShip.y;
    const angleToPlayer = Math.atan2(dy, dx);
    
    let cpuAngle = cpuShip.angle % (2 * Math.PI);
    if (cpuAngle < 0) cpuAngle += 2 * Math.PI;
    
    let targetAngle = angleToPlayer % (2 * Math.PI);
    if (targetAngle < 0) targetAngle += 2 * Math.PI;
    
    let angleDiff = targetAngle - cpuAngle;
    
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    if (angleDiff > 0.1) {
      aiKeys.right = true;
    } else if (angleDiff < -0.1) {
      aiKeys.left = true;
    }
    
    if (difficulty > 1) {
      const distToSun = Math.sqrt(
        Math.pow(cpuShip.x - sun.x, 2) + 
        Math.pow(cpuShip.y - sun.y, 2)
      );
      
      if (distToSun < sun.radius * 3) {
        const angleToSun = Math.atan2(cpuShip.y - sun.y, cpuShip.x - sun.x);
        const sunAngleDiff = angleToSun - cpuShip.angle;
        
        if (Math.abs(sunAngleDiff) < Math.PI / 4) {
          aiKeys.left = !aiKeys.left;
          aiKeys.right = !aiKeys.right;
        }
      }
    }
    
    if (difficulty > 2 && Math.random() < 0.05) {
      aiKeys.left = Math.random() > 0.5;
      aiKeys.right = !aiKeys.left;
    }
    
    return aiKeys;
  };
  
  const fireProjectile = (ship: Ship) => {
    const newProjectile: Projectile = {
      x: ship.x + Math.cos(ship.angle) * 15,
      y: ship.y + Math.sin(ship.angle) * 15,
      velocity: {
        x: ship.velocity.x + Math.cos(ship.angle) * projectileSpeed,
        y: ship.velocity.y + Math.sin(ship.angle) * projectileSpeed
      },
      life: projectileLifetime,
      active: true
    };
    
    const updatedShip = { ...ship };
    updatedShip.projectiles = [...updatedShip.projectiles, newProjectile];
    
    if (ship === playerShip) {
      setPlayerShip(updatedShip);
    } else {
      setCpuShip(updatedShip);
    }
  };
  
  const checkProjectileHits = () => {
    let playerShipUpdated = { ...playerShip };
    let cpuShipUpdated = { ...cpuShip };
    
    playerShipUpdated.projectiles.forEach((proj, i) => {
      if (!proj.active) return;
      
      const dx = proj.x - cpuShip.x;
      const dy = proj.y - cpuShip.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < cpuShip.radius + 5) {
        playerShipUpdated.projectiles[i].active = false;
        cpuShipUpdated.hitCount++;
      }
    });
    
    cpuShipUpdated.projectiles.forEach((proj, i) => {
      if (!proj.active) return;
      
      const dx = proj.x - playerShip.x;
      const dy = proj.y - playerShip.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < playerShip.radius + 5) {
        cpuShipUpdated.projectiles[i].active = false;
        playerShipUpdated.hitCount++;
      }
    });
    
    setPlayerShip(playerShipUpdated);
    setCpuShip(cpuShipUpdated);
  };
  
  const handleLeftButton = () => {
    setKeys(prev => ({ ...prev, left: true }));
  };
  
  const handleRightButton = () => {
    setKeys(prev => ({ ...prev, right: true }));
  };
  
  const handleButtonUp = () => {
    setKeys({ left: false, right: false });
  };
  
  const handlePlayAgain = () => {
    setPlayerShip({
      x: gameAreaWidth * 0.25,
      y: gameAreaHeight / 2,
      angle: 0,
      velocity: { x: 0, y: 0 },
      thrust: false,
      cooldown: 0,
      projectiles: [],
      radius: 10,
      hitCount: 0
    });
    
    setCpuShip({
      x: gameAreaWidth * 0.75,
      y: gameAreaHeight / 2,
      angle: Math.PI,
      velocity: { x: 0, y: 0 },
      thrust: false,
      cooldown: 0,
      projectiles: [],
      radius: 10,
      hitCount: 0
    });
    
    setGameOver(false);
    setGameStarted(true);
    
    if (!gameWon) {
      onPlayAgain(false);
    }
  };
  
  const handleContinue = () => {
    onGameComplete();
  };
  
  const handleStartGame = () => {
    setShowInstructions(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <GameInfo 
        showInstructions={showInstructions}
        winningScore={WINNING_SCORE}
        userScore={playerShip.hitCount}
        computerScore={cpuShip.hitCount}
        difficulty={difficulty}
      />
      
      {showInstructions ? (
        <button
          onClick={handleStartGame}
          className="mt-4 px-8 py-4 bg-terminal-green text-black font-bold rounded hover:bg-opacity-80"
        >
          Start Game
        </button>
      ) : (
        <div className="relative w-full max-w-[600px] flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={gameAreaWidth}
            height={gameAreaHeight}
            className="border border-terminal-green bg-black"
          />
          
          {gameOver && (
            <GameResult
              gameWon={gameWon}
              onContinue={handleContinue}
              onPlayAgain={handlePlayAgain}
              alwaysShowContinue={false}
            />
          )}
          
          {isMobile && (
            <GameControls
              handleLeftButton={handleLeftButton}
              handleRightButton={handleRightButton}
              handleButtonUp={handleButtonUp}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SpacePeaceGame;
