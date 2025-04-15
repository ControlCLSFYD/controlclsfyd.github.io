
import { useState, useEffect, RefObject, useCallback } from 'react';
import { GameState } from '../interfaces/GameInterfaces';
import { useIsMobile } from './use-mobile';
import { 
  checkCollision, 
  generateStars, 
  generateAsteroids,
  updateAsteroids
} from '../utils/spacewarGameUtils';
import {
  drawPlayerShip,
  drawEnemyShip,
  drawBullets,
  drawAsteroids,
  drawStars
} from '../utils/spacewarRenderer';

interface UseSpacewarGameProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  difficulty: number;
  onGameComplete: () => void;
}

const useSpacewarGame = ({ canvasRef, difficulty, onGameComplete }: UseSpacewarGameProps) => {
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: true,
    gameOver: false,
    gameWon: false,
    score: 0
  });
  const [showInstructions, setShowInstructions] = useState(true);
  const isMobile = useIsMobile();

  const WINNING_SCORE = 20;

  const canvasWidth = isMobile ? 320 : 600;
  const canvasHeight = isMobile ? 240 : 400;

  // Use useCallback to prevent recreation of these handlers on each render
  const handleLeftButton = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  }, []);

  const handleRightButton = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  }, []);

  const handleButtonUp = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
  }, []);

  const handleContinue = useCallback(() => {
    onGameComplete();
  }, [onGameComplete]);

  const resetGame = useCallback(() => {
    setUserScore(0);
    setComputerScore(0);
    setGameState({
      gameStarted: true,
      gameOver: false,
      gameWon: false,
      score: 0
    });
  }, []);

  useEffect(() => {
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    const instructionsTimer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const shipSize = isMobile ? 10 : 15;
    const bulletSize = Math.max(1.5, Math.floor(canvasWidth * 0.003));
    const enemySize = isMobile ? 10 : 15;
    const asteroidSize = isMobile ? 7 : 10;
    const starCount = isMobile ? 50 : 70; // Reduce star count on mobile

    const stars = generateStars(starCount, canvasWidth, canvasHeight);

    let playerX = canvasWidth / 2;
    let playerY = canvasHeight - shipSize * 2;
    const playerSpeed = 5;
    let playerBullets: { x: number; y: number; active: boolean }[] = [];

    let enemyX = canvasWidth / 2;
    let enemyY = shipSize * 2;
    const enemySpeed = 3.0 + (difficulty * 0.5);
    let enemyBullets: { x: number; y: number; active: boolean }[] = [];
    let enemyMoveDirection = 1;

    // Limit the number of asteroids on mobile for better performance
    const asteroidCount = isMobile ? 3 : 5;
    const asteroids = generateAsteroids(asteroidCount, canvasWidth, canvasHeight);

    let rightPressed = false;
    let leftPressed = false;
    let lastAutoFireTime = Date.now();
    const autoFireInterval = 420 - (difficulty * 20);
    const enemyFireInterval = 380 - (difficulty * 50);

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    let lastEnemyFireTime = Date.now();
    let lastFrameTime = performance.now();
    const targetFPS = 60;
    const frameDelay = 1000 / targetFPS;

    const updateEnemyAI = () => {
      if (Math.random() < (0.5 + difficulty * 0.05)) {
        if (playerX < enemyX - 10) {
          enemyMoveDirection = -1;
        } else if (playerX > enemyX + 10) {
          enemyMoveDirection = 1;
        }
      }
      
      if (Math.random() < (0.02 - difficulty * 0.003)) {
        enemyMoveDirection *= -1;
      }
      
      const currentTime = Date.now();
      if (currentTime - lastEnemyFireTime > enemyFireInterval) {
        if (Math.abs(enemyX - playerX) < (shipSize * (4 - difficulty * 0.5)) || Math.random() > (0.5 - difficulty * 0.08)) { 
          enemyBullets.push({
            x: enemyX,
            y: enemyY + shipSize / 2,
            active: true
          });
        }
        lastEnemyFireTime = currentTime;
      }
    };

    let gameActive = !gameState.gameOver;
    let animationFrameId: number;

    const draw = (timestamp: number) => {
      if (!ctx || !gameActive) return;
      
      // Throttle the frame rate for consistent performance
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameDelay) {
        animationFrameId = window.requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = timestamp - (elapsed % frameDelay);
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      drawStars(ctx, stars);
      
      if (rightPressed && playerX < canvasWidth - shipSize) {
        playerX += playerSpeed;
      } else if (leftPressed && playerX > shipSize) {
        playerX -= playerSpeed;
      }
      
      updateEnemyAI();
      
      enemyX += enemySpeed * enemyMoveDirection;
      if (enemyX > canvasWidth - shipSize || enemyX < shipSize) {
        enemyMoveDirection *= -1;
      }
      
      const currentTime = Date.now();
      if (currentTime - lastAutoFireTime > autoFireInterval) {
        if (playerBullets.length < (3 + difficulty)) {
          playerBullets.push({
            x: playerX,
            y: playerY - shipSize / 2,
            active: true
          });
        }
        lastAutoFireTime = currentTime;
      }
      
      // Update bullets and check for collisions
      playerBullets.forEach(bullet => {
        if (bullet.active) {
          bullet.y -= 8;
          if (bullet.y < 0) {
            bullet.active = false;
          }
          
          if (checkCollision(bullet.x, bullet.y, bulletSize, enemyX, enemyY, shipSize)) {
            setUserScore(prevScore => {
              const newScore = prevScore + 1;
              if (newScore >= WINNING_SCORE) {
                gameActive = false;
                setGameState({
                  gameStarted: false,
                  gameOver: true,
                  gameWon: true,
                  score: newScore
                });
              }
              return newScore;
            });
            bullet.active = false;
          }
          
          // Batch check asteroid collisions for better performance
          for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            if (checkCollision(bullet.x, bullet.y, bulletSize, asteroid.x, asteroid.y, asteroidSize)) {
              bullet.active = false;
              asteroid.x = Math.random() * canvasWidth;
              asteroid.y = Math.random() * (canvasHeight / 2) + 100;
              break;
            }
          }
        }
      });
      
      // Process enemy bullets
      enemyBullets.forEach(bullet => {
        if (bullet.active) {
          bullet.y += 6;
          if (bullet.y > canvasHeight) {
            bullet.active = false;
          }
          
          if (checkCollision(bullet.x, bullet.y, bulletSize, playerX, playerY, shipSize)) {
            setComputerScore(prevScore => {
              const newScore = prevScore + 1;
              if (newScore >= WINNING_SCORE) {
                gameActive = false;
                setGameState({
                  gameStarted: false, 
                  gameOver: true,
                  gameWon: false,
                  score: newScore
                });
              }
              return newScore;
            });
            bullet.active = false;
          }
        }
      });
      
      // Filter active bullets for rendering efficiency
      playerBullets = playerBullets.filter(bullet => bullet.active);
      enemyBullets = enemyBullets.filter(bullet => bullet.active);
      
      // Update asteroid positions
      updateAsteroids(asteroids, canvasWidth, canvasHeight, asteroidSize);

      // Draw game elements
      drawPlayerShip(ctx, playerX, playerY, shipSize);
      drawEnemyShip(ctx, enemyX, enemyY, shipSize);
      drawAsteroids(ctx, asteroids, asteroidSize);
      drawBullets(ctx, playerBullets, enemyBullets, bulletSize);
      
      if (gameActive) {
        animationFrameId = window.requestAnimationFrame(draw);
      }
    };

    animationFrameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      clearTimeout(instructionsTimer);
    };
  }, [gameState.gameOver, difficulty, isMobile, canvasWidth, canvasHeight, WINNING_SCORE, onGameComplete]);

  return {
    userScore,
    computerScore,
    gameState,
    showInstructions,
    canvasWidth,
    canvasHeight,
    WINNING_SCORE,
    handleLeftButton,
    handleRightButton,
    handleButtonUp,
    handleContinue,
    resetGame
  };
};

export default useSpacewarGame;
