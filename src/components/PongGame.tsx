import React, { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import GameControls from './GameControls';
import GameInfo from './GameInfo';

interface PongGameProps extends BaseGameProps {
  forceWin?: boolean;
}

const PongGame: React.FC<PongGameProps> = ({ 
  onGameComplete, 
  onPlayAgain, 
  difficulty = 1,
  forceWin = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasWonBefore, setHasWonBefore] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  
  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Paddle dimensions
  const paddleWidth = 10;
  const paddleHeight = 80;
  const paddleSpeed = 5;
  
  // Ball dimensions
  const ballSize = 10;
  const initialBallSpeed = 3;
  const maxBallSpeed = 10;
  
  // Winning score
  const WINNING_SCORE = 5;

  // Player paddle position
  const [playerPaddleY, setPlayerPaddleY] = useState((canvasHeight - paddleHeight) / 2);
  
  // Computer paddle position
  const [computerPaddleY, setComputerPaddleY] = useState((canvasHeight - paddleHeight) / 2);
  
  // Ball position and speed
  const [ballX, setBallX] = useState(canvasWidth / 2);
  const [ballY, setBallY] = useState(canvasHeight / 2);
  const [ballSpeedX, setBallSpeedX] = useState(initialBallSpeed);
  const [ballSpeedY, setBallSpeedY] = useState(1);
  
  const animationFrameRef = useRef<number>();
  
  // Function to reset the ball to the center
  const resetBall = () => {
    setBallX(canvasWidth / 2);
    setBallY(canvasHeight / 2);
    setBallSpeedX(initialBallSpeed * (Math.random() > 0.5 ? 1 : -1));
    setBallSpeedY((Math.random() * 2 - 1) * 2);
  };
  
  // Function to update the game state
  const updateGame = () => {
    if (!canvasRef.current || gameOver) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw player paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight);
    
    // Draw computer paddle
    ctx.fillRect(canvasWidth - paddleWidth, computerPaddleY, paddleWidth, paddleHeight);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    
    // Move ball
    setBallX(prevBallX => prevBallX + ballSpeedX);
    setBallY(prevBallY => prevBallY + ballSpeedY);
    
    // Bounce off top and bottom walls
    if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > canvasHeight) {
      setBallSpeedY(-ballSpeedY);
    }
    
    // Bounce off player paddle
    if (ballX - ballSize / 2 < paddleWidth && ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
      setBallSpeedX(Math.abs(ballSpeedX) * 1.1); // Increase speed
      setBallSpeedY((ballY - (playerPaddleY + paddleHeight / 2)) / (paddleHeight / 2) * 3);
    }
    
    // Bounce off computer paddle
    if (ballX + ballSize / 2 > canvasWidth - paddleWidth && ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
      setBallSpeedX(-Math.abs(ballSpeedX) * 1.1); // Increase speed
      setBallSpeedY((ballY - (computerPaddleY + paddleHeight / 2)) / (paddleHeight / 2) * 3);
    }
    
    // Computer paddle AI
    const computerSpeed = paddleSpeed * currentDifficulty;
    if (computerPaddleY + paddleHeight / 2 < ballY) {
      setComputerPaddleY(prevComputerPaddleY => Math.min(prevComputerPaddleY + computerSpeed, canvasHeight - paddleHeight));
    } else if (computerPaddleY + paddleHeight / 2 > ballY) {
      setComputerPaddleY(prevComputerPaddleY => Math.max(prevComputerPaddleY - computerSpeed, 0));
    }
    
    // Check if ball went out of bounds
    if (ballX < 0) {
      setComputerScore(prevScore => prevScore + 1);
      resetBall();
    } else if (ballX > canvasWidth) {
      setPlayerScore(prevScore => prevScore + 1);
      resetBall();
    }
    
    // Check for game over
    if (playerScore >= WINNING_SCORE) {
      setGameOver(true);
      setGameWon(true);
      setHasWonBefore(true);
    } else if (computerScore >= WINNING_SCORE) {
      setGameOver(true);
      setGameWon(false);
    }
    
    animationFrameRef.current = requestAnimationFrame(updateGame);
  };
  
  // Function to handle player paddle movement
  const movePaddle = (direction: 'up' | 'down') => {
    if (gameOver) return;
    
    if (direction === 'up') {
      setPlayerPaddleY(prevPaddleY => Math.max(prevPaddleY - paddleSpeed, 0));
    } else {
      setPlayerPaddleY(prevPaddleY => Math.min(prevPaddleY + paddleSpeed, canvasHeight - paddleHeight));
    }
  };
  
  // Function to start the game
  const startGame = () => {
    resetBall();
    setPlayerScore(0);
    setComputerScore(0);
    setGameOver(false);
    setGameWon(false);
    setShowInstructions(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateGame);
  };
  
  // Function to handle game completion
  const handleContinue = () => {
    onGameComplete();
  };
  
  // Function to handle playing again
  const handlePlayAgain = () => {
    if (gameWon) {
      setCurrentDifficulty(prev => Math.min(prev + 1, 5));
    }
    startGame();
    onPlayAgain(gameWon);
  };

  // Add effect for the forceWin prop
  useEffect(() => {
    if (forceWin && !gameWon) {
      // Force player to win
      setPlayerScore(WINNING_SCORE);
      setGameOver(true);
      setGameWon(true);
    }
  }, [forceWin]);
  
  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        movePaddle('up');
      } else if (e.key === 'ArrowDown') {
        movePaddle('down');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);
  
  // Touch event listeners for mobile
  const handleTouchStart = (e: TouchEvent) => {
    const touchY = e.touches[0].clientY;
    if (touchY < canvasHeight / 2) {
      movePaddle('up');
    } else {
      movePaddle('down');
    }
  };
  
  // Start game when component mounts
  useEffect(() => {
    startGame();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentDifficulty]);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <GameInfo 
        showInstructions={showInstructions}
        winningScore={WINNING_SCORE}
        userScore={playerScore}
        computerScore={computerScore}
        difficulty={currentDifficulty}
      />
      
      <div className="border border-terminal-green">
        <canvas 
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-black"
          onTouchStart={isMobile ? handleTouchStart : undefined}
        />
      </div>
      
      {gameOver && (
        <GameResult 
          gameWon={gameWon}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={hasWonBefore}
        />
      )}
      
      {isMobile && (
        <GameControls
          handleLeftButton={() => movePaddle('up')}
          handleRightButton={() => movePaddle('down')}
          handleButtonUp={() => {}}
        />
      )}
    </div>
  );
};

export default PongGame;
