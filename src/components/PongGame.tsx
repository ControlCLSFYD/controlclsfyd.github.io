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

  const isMobile = useIsMobile();
  const canvasWidth = isMobile ? 320 : 600;
  const canvasHeight = isMobile ? 240 : 400;

  const paddleHeight = Math.max(6, Math.floor(canvasHeight * 0.02));
  const paddleWidth = Math.max(40, Math.floor(canvasWidth * 0.1));
  const ballRadius = Math.max(3, Math.floor(canvasWidth * 0.007));

  const winningScore = 3;

  const handleContinue = () => {
    onGameComplete();
  };

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

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

  const handleLeftButton = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  };

  const handleRightButton = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  };

  const handleButtonUp = () => {
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
  };

  useEffect(() => {
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=0.9, maximum-scale=1.0, user-scalable=no');
      }
    }

    const instructionsTimer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let userPaddleX = (canvasWidth - paddleWidth) / 2;
    let computerPaddleX = (canvasWidth - paddleWidth) / 2;
    
    let ballX = canvasWidth / 2;
    let ballY = canvasHeight / 8;
    
    const baseHorizontalSpeed = isMobile ? 2 + (difficulty * 0.3) : 2.5 + (difficulty * 0.3); 
    const baseVerticalSpeed = isMobile ? 3.5 + (difficulty * 0.4) : 4 + (difficulty * 0.4);
    
    let ballDX = baseHorizontalSpeed * (Math.random() > 0.5 ? 1 : -1);
    let ballDY = baseVerticalSpeed;
    
    let rightPressed = false;
    let leftPressed = false;
    
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

    let animationFrameId: number;
    let gameActive = !gameState.gameOver;

    const draw = () => {
      if (!ctx || !gameActive) return;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#9b87f5';
      ctx.fill();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.rect(userPaddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#D6BCFA';
      ctx.fill();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.rect(computerPaddleX, 0, paddleWidth, paddleHeight);
      ctx.fillStyle = '#7E69AB';
      ctx.fill();
      ctx.closePath();
      
      const computerSpeed = 1.2 + (difficulty * 0.2);
      const computerTargetX = ballX - paddleWidth / 2;
      
      if (ballDY < 0) {
        const precisionThreshold = Math.max(10 - (difficulty * 1.5), 2);
        if (computerPaddleX < computerTargetX - precisionThreshold) {
          computerPaddleX += computerSpeed;
        } else if (computerPaddleX > computerTargetX + precisionThreshold) {
          computerPaddleX -= computerSpeed;
        }
      }
      
      const userPaddleSpeed = 7;
      if (rightPressed && userPaddleX < canvasWidth - paddleWidth) {
        userPaddleX += userPaddleSpeed;
      } else if (leftPressed && userPaddleX > 0) {
        userPaddleX -= userPaddleSpeed;
      }
      
      if (
        ballY + ballDY > canvasHeight - paddleHeight - ballRadius &&
        ballX > userPaddleX &&
        ballX < userPaddleX + paddleWidth
      ) {
        ballDY = -ballDY;
        const hitPosition = (ballX - userPaddleX) / paddleWidth;
        ballDX = baseHorizontalSpeed * 2.5 * (hitPosition - 0.5);
      }
      
      if (
        ballY + ballDY < paddleHeight + ballRadius &&
        ballX > computerPaddleX &&
        ballX < computerPaddleX + paddleWidth
      ) {
        ballDY = -ballDY;
        const hitPosition = (ballX - computerPaddleX) / paddleWidth;
        ballDX = baseHorizontalSpeed * 2.5 * (hitPosition - 0.5);
      }
      
      if (ballX + ballDX > canvasWidth - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
      }
      
      if (ballY + ballDY < 0) {
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
      
      ballX += ballDX;
      ballY += ballDY;
      
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    const resetBall = () => {
      ballX = canvasWidth / 2;
      ballY = canvasHeight / 8;
      ballDX = baseHorizontalSpeed * (Math.random() > 0.5 ? 1 : -1);
      ballDY = baseVerticalSpeed;
    };
    
    draw();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      clearTimeout(instructionsTimer);
    };
  }, [gameState.gameOver, onGameComplete, winningScore, isMobile, canvasWidth, canvasHeight, difficulty]);
  
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl mb-4">PONG CHALLENGE</h2>
      
      <div className="h-20">
        {showInstructions ? (
          <div className="flex items-center justify-center p-2 border border-terminal-green">
            <span>Use</span>
            <ArrowLeft className="mx-1" size={20} />
            <ArrowRight className="mx-1" size={20} />
            <span>keys to move your paddle</span>
          </div>
        ) : (
          <div>
            <p className="mb-2">Score {winningScore} points to continue</p>
            {difficulty > 1 && (
              <p className="mb-2 text-yellow-400">CPU Difficulty Level: {difficulty}</p>
            )}
          </div>
        )}
      </div>
      
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

      {gameState.gameOver && (
        <GameResult 
          gameWon={gameState.gameWon}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={true}
        />
      )}
      
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
