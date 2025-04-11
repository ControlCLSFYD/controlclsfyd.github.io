
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Rocket } from 'lucide-react';

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

  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;

  useEffect(() => {
    // Auto-hide instructions after 3 seconds
    const instructionsTimer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);

    // Game initialization
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game elements
    const shipSize = 20;
    const bulletSize = 3;
    const enemySize = 20;
    const asteroidSize = 15;
    const starCount = 50;

    // Define stars (background)
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2 + 1,
    }));

    // Player ship
    let playerX = canvasWidth / 2;
    let playerY = canvasHeight - shipSize * 2;
    const playerSpeed = 5;
    let playerBullets: { x: number; y: number; active: boolean }[] = [];

    // Enemy ship
    let enemyX = canvasWidth / 2;
    let enemyY = shipSize * 2;
    const enemySpeed = 2;
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
      ctx.fillStyle = '#00FF00';
      ctx.fill();
    };

    // Draw enemy ship
    const drawEnemyShip = () => {
      ctx.beginPath();
      ctx.moveTo(enemyX, enemyY + shipSize);
      ctx.lineTo(enemyX + shipSize, enemyY - shipSize);
      ctx.lineTo(enemyX - shipSize, enemyY - shipSize);
      ctx.closePath();
      ctx.fillStyle = '#FF0000';
      ctx.fill();
    };

    // Draw bullets
    const drawBullets = () => {
      // Player bullets
      ctx.fillStyle = '#00FF00';
      playerBullets.forEach(bullet => {
        if (bullet.active) {
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      });
      
      // Enemy bullets
      ctx.fillStyle = '#FF0000';
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
      ctx.fillStyle = '#AAAAAA';
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
      if (currentTime - lastEnemyFireTime > 1000) { // Fire every second
        if (Math.random() > 0.5) { // 50% chance to fire
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
      
      // Draw scores and time
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#00FF00';
      ctx.fillText(`YOU: ${userScore}`, 20, canvasHeight - 20);
      ctx.fillText(`CPU: ${computerScore}`, 20, 20);
      ctx.fillText(`TIME: ${timeLeft}`, canvasWidth - 80, 20);
      
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
  }, [onGameComplete]);
  
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl mb-4">SPACEWAR CHALLENGE</h2>
      <p className="mb-2">Score more points than the CPU in 30 seconds</p>
      
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
      
      <div className="mb-2">Time: {timeLeft}s</div>
      <div className="mb-4">
        <span className="mr-4">Player: {userScore}</span>
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
    </div>
  );
};

export default SpacewarGame;
