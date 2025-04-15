
import React, { useRef, useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import useSpacewarGame from '../hooks/useSpacewarGame';

interface SpacePeaceGameProps extends BaseGameProps {}

const SpacePeaceGame: React.FC<SpacePeaceGameProps> = ({ 
  onGameComplete, 
  onPlayAgain, 
  difficulty = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [hasWonBefore, setHasWonBefore] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [secretProgress, setSecretProgress] = useState("");
  const [secretCount, setSecretCount] = useState(0);
  const [showPurr, setShowPurr] = useState(false);
  const [showBigPurr, setShowBigPurr] = useState(false);
  const [showTearDrop, setShowTearDrop] = useState(false);
  
  const { 
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
    handleContinue: originalHandleContinue,
    resetGame
  } = useSpacewarGame({ 
    canvasRef, 
    difficulty: currentDifficulty, 
    onGameComplete 
  });

  // Secret phrase handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newProgress = secretProgress;
      
      if (/^[ps]$/i.test(e.key)) {
        newProgress += e.key.toLowerCase();
        
        // Check for pattern "pspspspspspspspspspspsps" (22 characters)
        if (newProgress.length > 22) {
          newProgress = newProgress.substring(1);
        }
        
        // Check if we have a "psps" pattern
        if (newProgress.endsWith("psps")) {
          setShowPurr(true);
          setTimeout(() => setShowPurr(false), 2000);
        }
        
        // Check if we have the full pattern
        if (newProgress === "pspspspspspspspspspspsps") {
          setSecretCount(prevCount => {
            const newCount = prevCount + 1;
            
            // After 8 repetitions (16 "psps" words)
            if (newCount >= 8 && !showBigPurr) {
              setShowBigPurr(true);
              setShowTearDrop(true);
              setTimeout(() => setShowTearDrop(false), 3000);
            }
            
            // After 20 repetitions, trigger victory (changed from 12)
            if (newCount >= 20) {
              gameState.gameWon = true;
              gameState.gameOver = true;
              originalHandleContinue();
            }
            
            return newCount;
          });
          
          // Reset progress after full pattern
          newProgress = "";
        }
      } else {
        // Any other key resets progress
        newProgress = "";
      }
      
      setSecretProgress(newProgress);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [secretProgress, secretCount, originalHandleContinue, gameState]);

  useEffect(() => {
    // Set hasWonBefore to true if the player has won
    if (gameState.gameWon && !hasWonBefore) {
      setHasWonBefore(true);
    }
  }, [gameState.gameWon, hasWonBefore]);

  const handlePlayAgain = () => {
    // Only increase difficulty if player has won at least once
    if (gameState.gameWon) {
      setCurrentDifficulty(prev => Math.min(prev + 1, 5));
    }
    resetGame();
    onPlayAgain();
  };

  const handleContinue = () => {
    originalHandleContinue();
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 relative">
      <GameInfo 
        showInstructions={showInstructions}
        winningScore={WINNING_SCORE}
        userScore={userScore}
        computerScore={computerScore}
        difficulty={currentDifficulty}
      />
      
      <div className="border border-terminal-green relative">
        <canvas 
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-black"
        />
        
        {/* Secret interaction effects */}
        {showPurr && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-terminal-green text-xs">purr</div>
        )}
        
        {showBigPurr && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-terminal-green text-xl font-bold">PURR</div>
        )}
        
        {showTearDrop && (
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 animate-fall">
            <style>
              {`
                @keyframes fall {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(100px); }
                }
                .animate-fall {
                  animation: fall 3s linear forwards;
                }
              `}
            </style>
            <div className="text-blue-300 text-lg">💧</div>
          </div>
        )}
      </div>
      
      {gameState.gameOver && (
        <GameResult 
          gameWon={gameState.gameWon}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={hasWonBefore}
        />
      )}
      
      {secretCount > 0 && secretCount < 20 && (
        <div className="mt-2 text-xs text-terminal-green">
          Secret pattern count: {secretCount}/20
        </div>
      )}
      
      {isMobile && (
        <GameControls
          handleLeftButton={handleLeftButton}
          handleRightButton={handleRightButton}
          handleButtonUp={handleButtonUp}
        />
      )}
    </div>
  );
};

export default SpacePeaceGame;
