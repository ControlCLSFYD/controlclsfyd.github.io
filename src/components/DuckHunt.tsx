
import React, { useEffect, useState, useRef } from 'react';
import { useDuckHunt } from '../hooks/useDuckHunt';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';

const DuckHunt: React.FC<BaseGameProps> = ({ 
  onGameComplete, 
  onPlayAgain,
  difficulty = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    handleCanvasClick,
    resetGame,
    handleAnimationFrame
  } = useDuckHunt({ 
    canvasRef, 
    onGameComplete, 
    difficulty 
  });

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      handleAnimationFrame();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleAnimationFrame]);

  const handleContinue = () => {
    onGameComplete();
  };

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain(gameState.gameWon);
  };

  if (gameState.gameOver) {
    return (
      <GameResult
        gameWon={gameState.gameWon}
        onContinue={handleContinue}
        onPlayAgain={handlePlayAgain}
        alwaysShowContinue={true}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="text-lg mb-2">Score: {gameState.score} / 10</div>
      <div 
        className="relative w-full h-[70vh] md:h-[60vh] bg-sky-200 border border-gray-400 rounded-md overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent scrolling on mobile
            const touch = e.touches[0];
            const targetRect = e.currentTarget.getBoundingClientRect();
            const x = touch.clientX - targetRect.left;
            const y = touch.clientY - targetRect.top;
            
            // Pass coordinates to the click handler
            handleCanvasClick({ 
              nativeEvent: { offsetX: x, offsetY: y } 
            } as React.MouseEvent<HTMLCanvasElement>);
          }}
          className="block w-full h-full cursor-crosshair"
          width={800}
          height={600}
        />
      </div>
    </div>
  );
};

export default DuckHunt;
