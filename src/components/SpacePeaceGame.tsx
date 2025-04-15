
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Track the keys 'p' and 's' to detect the secret pattern
      if (e.key === 'p' || e.key === 's') {
        setSecretProgress(prev => {
          const newProgress = prev + e.key;
          
          // Check if the pattern 'pspspsps' appears in the progress
          if (newProgress.includes('pspspsps')) {
            setSecretCount(prevCount => {
              const newCount = prevCount + 1;
              
              // Show "purr" visual feedback
              setShowPurr(true);
              setTimeout(() => setShowPurr(false), 1000);
              
              // Trigger victory after typing the pattern 5 times
              if (newCount >= 5) {
                gameState.gameWon = true;
                gameState.gameOver = true;
              }
              
              return newCount;
            });
            
            // Reset progress after detecting the pattern
            return '';
          }
          
          // Limit the length of the progress to avoid memory issues
          if (newProgress.length > 20) {
            return newProgress.slice(-20);
          }
          
          return newProgress;
        });
      } else {
        // Reset progress for other keys
        setSecretProgress('');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

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
    setSecretCount(0);
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
        
        {showPurr && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-terminal-green text-sm">
            purr
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
      
      {secretCount > 0 && secretCount < 5 && (
        <div className="mt-2 text-xs text-terminal-green">
          Secret pattern count: {secretCount}/5
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
