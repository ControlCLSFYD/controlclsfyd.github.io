
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';

interface PongGameProps extends BaseGameProps {}

const PongGame: React.FC<PongGameProps> = ({ onGameComplete, onPlayAgain, difficulty = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: true,
    gameOver: false,
    gameWon: false,
    score: 0
  });
  const [showInstructions, setShowInstructions] = useState(true);

  // Canvas dimensions - responsive based on screen
  const isMobile = useIsMobile();
  const canvasWidth = isMobile ? 320 : 600;
  const canvasHeight = isMobile ? 240 : 400;

  // Game elements - sized proportionally based on canvas
  const paddleHeight = Math.max(6, Math.floor(canvasHeight * 0.02)); // Scaled for mobile
  const paddleWidth = Math.max(40, Math.floor(canvasWidth * 0.1)); // Scaled for mobile
  const ballRadius = Math.max(3, Math.floor(canvasWidth * 0.007)); // Scaled for mobile
  
  // Winning score - 3 points to win
  const winningScore = 3;

  // Handle game completion
  const handleContinue = () => {
    onGameComplete();
  };

  // Handle play again with increased difficulty
  const handlePlayAgain = () => {
    onPlayAgain();
  };

  // Reset the game state
  const resetGame = () => {
    setUserScore(0);
    setComputerScore(0);
    setGameState({
      gameStarted: true,
      gameOver: false,
      gameWon: false,
      score: 0
    });
  };

  // Mobile controls
  const handleLeftButton = () => {
    // This function will be called by the mobile left button
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  };

  const handleRightButton = () => {
    // This function will be called by the mobile right button
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  };

  const handleButtonUp = () => {
    // Release keys when touch ends
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
  };

  useEffect(() => {
    // Set viewport meta for mobile devices
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=0.9, maximum-scale=1.0, user-scalable=no');
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

    // Initial positions
    let userPaddleX = (canvasWidth - paddleWidth) / 2;
    let computerPaddleX = (canvasWidth - paddleWidth) / 2;
    
    // Ball variables
    let ballX = canvasWidth / 2;
    // Start the ball from further away (closer to the computer side)
    let ballY = canvasHeight / 8; // Much closer to the CPU (top)
    
    // Initial direction - always towards player (bottom)
    // Reduced speed for mobile, slightly slower in general
    const baseHorizontalSpeed = isMobile ? 2 : 2.5; 
    const baseVerticalSpeed = isMobile ? 3.5 : 4;
    
    let ballDX = baseHorizontalSpeed * (Math.random() > 0.5 ? 1 : -1); // Initial horizontal speed
    let ballDY = baseVerticalSpeed; // Positive value means ball goes towards player
    
    // Key states
    let rightPressed = false;
    let leftPressed = false;
    
    // Key event listeners
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

    // Animation setup
    let animationFrameId: number;
    let gameActive = !gameState.gameOver;

    // Game loop
    const draw = () => {
      if (!ctx || !gameActive) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#9b87f5'; // Subtle purple color
      ctx.fill();
      ctx.closePath();
      
      // Draw user paddle (bottom)
      ctx.beginPath();
      ctx.rect(userPaddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#D6BCFA'; // Light purple
      ctx.fill();
      ctx.closePath();
      
      // Draw computer paddle (top)
      ctx.beginPath();
      ctx.rect(computerPaddleX, 0, paddleWidth, paddleHeight);
      ctx.fillStyle = '#7E69AB'; // Secondary purple
      ctx.fill();
      ctx.closePath();
      
      // Computer AI - follow the ball with a delay
      const computerSpeed = 1.2; // Reduced from 1.5 to be slower and easier
      const computerTargetX = ballX - paddleWidth / 2;
      
      // Add some "intelligence" - only move when the ball is moving towards the computer
      if (ballDY < 0) {
        if (computerPaddleX < computerTargetX - 10) {
          computerPaddleX += computerSpeed;
        } else if (computerPaddleX > computerTargetX + 10) {
          computerPaddleX -= computerSpeed;
        }
      }
      
      // User paddle movement
      const userPaddleSpeed = 7;
      if (rightPressed && userPaddleX < canvasWidth - paddleWidth) {
        userPaddleX += userPaddleSpeed;
      } else if (leftPressed && userPaddleX > 0) {
        userPaddleX -= userPaddleSpeed;
      }

      // Ball collision with paddles
      // User paddle collision
      if (
        ballY + ballDY > canvasHeight - paddleHeight - ballRadius &&
        ballX > userPaddleX &&
        ballX < userPaddleX + paddleWidth
      ) {
        ballDY = -ballDY;
        // Add some angle based on where the ball hits the paddle
        const hitPosition = (ballX - userPaddleX) / paddleWidth;
        ballDX = baseHorizontalSpeed * 2.5 * (hitPosition - 0.5); // For speed
      }
      
      // Computer paddle collision
      if (
        ballY + ballDY < paddleHeight + ballRadius &&
        ballX > computerPaddleX &&
        ballX < computerPaddleX + paddleWidth
      ) {
        ballDY = -ballDY;
        // Add some angle based on where the ball hits the paddle
        const hitPosition = (ballX - computerPaddleX) / paddleWidth;
        ballDX = baseHorizontalSpeed * 2.5 * (hitPosition - 0.5); // For speed
      }
      
      // Ball collision with walls (left/right)
      if (ballX + ballDX > canvasWidth - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
      }
      
      // Ball out of bounds (top/bottom)
      if (ballY + ballDY < 0) {
        // User scores - ball went past computer paddle
        setUserScore(prevScore => {
          const newScore = prevScore + 1;
          if (newScore >= winningScore) {
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
        resetBall();
      } else if (ballY + ballDY > canvasHeight) {
        // Computer scores - ball went past user paddle
        setComputerScore(prevScore => {
          const newScore = prevScore + 1;
          if (newScore >= winningScore) {
            gameActive = false;
            setGameState({
              gameStarted: false,
              gameOver: true,
              gameWon: false,
              score: 0
            });
          }
          return newScore;
        });
        resetBall();
      }
      
      // Move the ball
      ballX += ballDX;
      ballY += ballDY;
      
      // Continue the game loop
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    // Reset ball to center after scoring
    const resetBall = () => {
      ballX = canvasWidth / 2;
      // Start from closer to the computer side (only 1/8 down)
      ballY = canvasHeight / 8;
      // Always start towards the player side after reset
      ballDX = baseHorizontalSpeed * (Math.random() > 0.5 ? 1 : -1); // Random horizontal direction
      ballDY = baseVerticalSpeed; // Always towards player (positive)
    };
    
    // Start the game loop
    draw();
    
    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      clearTimeout(instructionsTimer);
    };
  }, [gameState.gameOver, onGameComplete, winningScore, isMobile, canvasWidth, canvasHeight]);
  
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl mb-4">PONG CHALLENGE</h2>
      <p className="mb-2">Score {winningScore} points to continue</p>
      
      {showInstructions && (
        <div className="flex items-center mb-4 p-2 border border-terminal-green">
          <span>Use</span>
          <ArrowLeft className="mx-1" size={20} />
          <ArrowRight className="mx-1" size={20} />
          <span>keys to move your paddle</span>
        </div>
      )}
      
      <div className="mt-4 flex justify-between w-full max-w-[600px] px-4 mb-2">
        <div className="text-lg">YOU: {userScore}</div>
        <div className="text-lg">CPU: {computerScore}</div>
      </div>
      
      <div className="border border-terminal-green">
        <canvas 
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-black"
        />
      </div>

      {/* Game results overlay */}
      {gameState.gameOver && (
        <GameResult 
          gameWon={gameState.gameWon}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
        />
      )}
      
      {/* Mobile controls - visible for all mobile devices */}
      {isMobile && (
        <div className="mt-4 flex justify-center w-full">
          <div className="grid grid-cols-2 gap-4">
            <button
              onTouchStart={handleLeftButton}
              onTouchEnd={handleButtonUp}
              className="p-6 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green"
            >
              <ArrowLeft size={32} color="#D6BCFA" />
            </button>
            <button
              onTouchStart={handleRightButton}
              onTouchEnd={handleButtonUp}
              className="p-6 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green"
            >
              <ArrowRight size={32} color="#D6BCFA" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PongGame;
