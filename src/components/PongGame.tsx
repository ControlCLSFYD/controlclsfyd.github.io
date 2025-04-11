
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PongGameProps {
  onGameComplete: () => void;
}

const PongGame: React.FC<PongGameProps> = ({ onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;

  // Game elements
  const paddleHeight = 10;
  const paddleWidth = 75;
  const ballRadius = 6;

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

    // Initial positions
    let userPaddleX = (canvasWidth - paddleWidth) / 2;
    let computerPaddleX = (canvasWidth - paddleWidth) / 2;
    
    // Ball variables
    let ballX = canvasWidth / 2;
    let ballY = canvasHeight / 2;
    // Initial direction - towards computer (top)
    let ballDX = 3 * (Math.random() > 0.5 ? 1 : -1); // Increased initial horizontal speed
    let ballDY = -5; // Increased initial vertical speed
    
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

    // Game loop
    const draw = () => {
      if (!ctx || !gameActive) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#00FF00';
      ctx.fill();
      ctx.closePath();
      
      // Draw user paddle (bottom)
      ctx.beginPath();
      ctx.rect(userPaddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#00FF00';
      ctx.fill();
      ctx.closePath();
      
      // Draw computer paddle (top)
      ctx.beginPath();
      ctx.rect(computerPaddleX, 0, paddleWidth, paddleHeight);
      ctx.fillStyle = '#00FF00';
      ctx.fill();
      ctx.closePath();
      
      // Draw scores
      ctx.font = '16px VT323, monospace';
      ctx.fillStyle = '#00FF00';
      ctx.fillText(`YOU: ${userScore}`, 20, canvasHeight - 20);
      ctx.fillText(`CPU: ${computerScore}`, 20, 20);

      // Computer AI - follow the ball with a delay
      const computerSpeed = 1.8; // Reduced from 3 to make it slower and easier
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
        ballDX = 7 * (hitPosition - 0.5); // Increased from 6 to 7 for more speed
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
        ballDX = 7 * (hitPosition - 0.5); // Increased from 6 to 7 for more speed
      }
      
      // Ball collision with walls (left/right)
      if (ballX + ballDX > canvasWidth - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
      }
      
      // Ball out of bounds (top/bottom)
      if (ballY + ballDY < 0) {
        // User scores
        setUserScore(prev => {
          const newScore = prev + 1;
          if (newScore >= 2) {
            setGameActive(false);
            setTimeout(() => onGameComplete(), 1000);
          }
          return newScore;
        });
        resetBall();
      } else if (ballY + ballDY > canvasHeight) {
        // Computer scores
        setComputerScore(prev => prev + 1);
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
      ballY = canvasHeight / 2;
      // Always start towards the computer side after reset
      ballDX = 3 * (Math.random() > 0.5 ? 1 : -1); // Increased from 2 to 3
      ballDY = -5; // Increased from -3.5 to -5
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
  }, [gameActive, onGameComplete]);
  
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl mb-4">PONG CHALLENGE</h2>
      <p className="mb-2">Score 2 points to continue</p>
      
      {showInstructions && (
        <div className="flex items-center mb-4 p-2 border border-terminal-green">
          <span>Use</span>
          <ArrowLeft className="mx-1" size={20} />
          <ArrowRight className="mx-1" size={20} />
          <span>keys to move your paddle</span>
        </div>
      )}
      
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

export default PongGame;
