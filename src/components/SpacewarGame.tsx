import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Rocket } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface SpacewarGameProps {
  onGameComplete: () => void;
}

const SpacewarGame: React.FC<SpacewarGameProps> = ({ onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds game
  const isMobile = useIsMobile();

  // Canvas dimensions - responsive based on screen
  const canvasWidth = isMobile ? 320 : 600;
  const canvasHeight = isMobile ? 240 : 400;

  // Mobile controls
  const handleLeftButton = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  };

  const handleRightButton = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  };

  const handleFireButton = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  };

  const handleButtonUp = () => {
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
  };

  useEffect(() => {
    // Set viewport meta for mobile devices
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    // Auto-hide instructions after 3 seconds
    const instructionsTimer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);

    // Game initialization
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game elements - smaller sizes for more stylish visuals - scale for mobile
    const shipSize = isMobile ? 10 : 15; // Reduced for mobile
    const bulletSize = Math.max(1.5, Math.floor(canvasWidth * 0.003)); // Scaled
    const enemySize = isMobile ? 10 : 15; // Reduced for mobile
    const asteroidSize = isMobile ? 7 : 10; // Reduced for mobile
    const starCount = 70; // Increased from 50 for more background detail

    // Define stars (background)
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 1.5 + 0.5, // Smaller stars
    }));

    // Player ship
    let playerX = canvasWidth / 2;
    let playerY = canvasHeight - shipSize * 2;
    const playerSpeed = 5;
    let playerBullets: { x: number; y: number; active: boolean }[] = [];

    // Enemy ship
    let enemyX = canvasWidth / 2;
    let enemyY = shipSize * 2;
    const enemySpeed = 2.5; // Increased from 2 to make CPU slightly better
    let enemyBullets: { x: number; y: number; active: boolean }[] = [];
    let enemyMoveDirection = 1; // 1 for right, -1 for left
    
    // Asteroids for obstacles
    const asteroids = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * (canvasHeight / 2) + 100,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    }));

    // Key states
    let rightPressed = false;
    let leftPressed = false;
    let upPressed = false;

    // Countdown timer
    const gameTimer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(gameTimer);
          setGameActive(false);
          
          // Determine the winner
          setTimeout(() => {
            onGameComplete();
          }, 2000);
          
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    // Key event listeners
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
      } else if (e.key === 'Up' || e.key === 'ArrowUp' || e.key === ' ') {
        upPressed = true;
        // Fire bullet on keydown for better responsiveness
        if (gameActive && playerBullets.length < 3) { // Limit bullets
          playerBullets.push({
            x: playerX,
            y: playerY - shipSize / 2,
            active: true
          });
        }
      }
    };
    
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
      } else if (e.key === 'Up' || e.key === 'ArrowUp' || e.key === ' ') {
        upPressed = false;
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    let lastEnemyFireTime = Date.now();
    let lastAsteroidSpawn = Date.now();

    // Animation setup
    let animationFrameId: number;

    // Draw player ship
    const drawPlayerShip = () => {
      ctx.beginPath();
      ctx.moveTo(playerX, playerY - shipSize);
      ctx.lineTo(playerX + shipSize, playerY + shipSize);
      ctx.lineTo(playerX - shipSize, playerY + shipSize);
      ctx.closePath();
      ctx.fillStyle = '#D6BCFA'; // Light purple
      ctx.fill();
    };

    // Draw enemy ship
    const drawEnemyShip = () => {
      ctx.beginPath();
      ctx.moveTo(enemyX, enemyY + shipSize);
      ctx.lineTo(enemyX + shipSize, enemyY - shipSize);
      ctx.lineTo(enemyX - shipSize, enemyY - shipSize);
      ctx.closePath();
      ctx.fillStyle = '#7E69AB'; // Secondary purple
      ctx.fill();
    };

    // Draw bullets
    const drawBullets = () => {
      // Player bullets
      ctx.fillStyle = '#D6BCFA'; // Light purple
      playerBullets.forEach(bullet => {
        if (bullet.active) {
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      });
      
      // Enemy bullets
      ctx.fillStyle = '#7E69AB'; // Secondary purple
      enemyBullets.forEach(bullet => {
        if (bullet.active) {
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      });
    };

    // Draw asteroids
    const drawAsteroids = () => {
      ctx.fillStyle = '#9F9EA1'; // Silver gray
      asteroids.forEach(asteroid => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroidSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    };

    // Draw stars
    const drawStars = () => {
      ctx.fillStyle = '#FFFFFF';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    };

    // Check collision between two objects
    const checkCollision = (x1: number, y1: number, size1: number, x2: number, y2: number, size2: number) => {
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      return distance < (size1 + size2);
    };

    // Game loop
    const draw = () => {
      if (!ctx || !gameActive) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw stars
      drawStars();
      
      // Move player
      if (rightPressed && playerX < canvasWidth - shipSize) {
        playerX += playerSpeed;
      } else if (leftPressed && playerX > shipSize) {
        playerX -= playerSpeed;
      }
      
      // Move enemy AI
      enemyX += enemySpeed * enemyMoveDirection;
      if (enemyX > canvasWidth - shipSize || enemyX < shipSize) {
        enemyMoveDirection *= -1;
      }
      
      // Enemy firing logic (random)
      const currentTime = Date.now();
      if (currentTime - lastEnemyFireTime > 900) { // Fire slightly more frequently (was 1000ms)
        if (Math.random() > 0.4) { // 60% chance to fire (was 50%)
          enemyBullets.push({
            x: enemyX,
            y: enemyY + shipSize / 2,
            active: true
          });
        }
        lastEnemyFireTime = currentTime;
      }
      
      // Move bullets
      playerBullets.forEach(bullet => {
        if (bullet.active) {
          bullet.y -= 8; // Move up
          // Check if out of bounds
          if (bullet.y < 0) {
            bullet.active = false;
          }
          
          // Check collision with enemy
          if (checkCollision(bullet.x, bullet.y, bulletSize, enemyX, enemyY, shipSize)) {
            setUserScore(score => score + 1);
            bullet.active = false;
          }
          
          // Check collision with asteroids
          asteroids.forEach(asteroid => {
            if (checkCollision(bullet.x, bullet.y, bulletSize, asteroid.x, asteroid.y, asteroidSize)) {
              bullet.active = false;
              // Move asteroid to random location after hit
              asteroid.x = Math.random() * canvasWidth;
              asteroid.y = Math.random() * (canvasHeight / 2) + 100;
            }
          });
        }
      });
      
      enemyBullets.forEach(bullet => {
        if (bullet.active) {
          bullet.y += 6; // Move down
          // Check if out of bounds
          if (bullet.y > canvasHeight) {
            bullet.active = false;
          }
          
          // Check collision with player
          if (checkCollision(bullet.x, bullet.y, bulletSize, playerX, playerY, shipSize)) {
            setComputerScore(score => score + 1);
            bullet.active = false;
          }
        }
      });
      
      // Remove inactive bullets
      playerBullets = playerBullets.filter(bullet => bullet.active);
      enemyBullets = enemyBullets.filter(bullet => bullet.active);
      
      // Move asteroids
      asteroids.forEach(asteroid => {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;
        
        // Bounce off walls
        if (asteroid.x > canvasWidth - asteroidSize || asteroid.x < asteroidSize) {
          asteroid.dx *= -1;
        }
        if (asteroid.y > canvasHeight - asteroidSize || asteroid.y < asteroidSize) {
          asteroid.dy *= -1;
        }
      });

      // Draw game elements
      drawPlayerShip();
      drawEnemyShip();
      drawAsteroids();
      drawBullets();
      
      // Remove in-game score display - we're using the outside one
      
      // Continue the game loop
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    // Start the game loop
    draw();
    
    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      clearTimeout(instructionsTimer);
      clearInterval(gameTimer);
    };
  }, [onGameComplete, isMobile, canvasWidth, canvasHeight]);
  
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl mb-4">SPACEWAR CHALLENGE</h2>
      <p className="mb-2">Score more points than the CPU in {timeLeft} seconds</p>
      
      {showInstructions && (
        <div className="flex items-center mb-4 p-2 border border-terminal-green">
          <span>Use</span>
          <ArrowLeft className="mx-1" size={20} />
          <ArrowRight className="mx-1" size={20} />
          <span>keys to move and</span>
          <ArrowUp className="mx-1" size={20} />
          <span>or Space to fire</span>
        </div>
      )}
      
      <div className="mb-4 flex justify-between w-full max-w-[600px] px-4">
        <span>Player: {userScore}</span>
        <span>Time: {timeLeft}s</span>
        <span>CPU: {computerScore}</span>
      </div>
      
      <div className="border border-terminal-green">
        <canvas 
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-black"
        />
      </div>
      
      {/* Mobile controls - visible for all mobile devices */}
      {isMobile && (
        <div className="mt-4 w-full max-w-[600px]">
          <div className="grid grid-cols-3 gap-4">
            <button
              onTouchStart={handleLeftButton}
              onTouchEnd={handleButtonUp}
              className="p-4 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green"
            >
              <ArrowLeft size={24} color="#D6BCFA" />
            </button>
            <button
              onTouchStart={handleFireButton}
              onTouchEnd={handleButtonUp}
              className="p-4 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green"
            >
              <ArrowUp size={24} color="#D6BCFA" />
            </button>
            <button
              onTouchStart={handleRightButton}
              onTouchEnd={handleButtonUp}
              className="p-4 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green"
            >
              <ArrowRight size={24} color="#D6BCFA" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacewarGame;
