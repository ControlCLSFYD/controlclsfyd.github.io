
import React, { useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import useSpacewarGame from '../hooks/useSpacewarGame';

interface SpacewarGameProps extends BaseGameProps {}

const SpacewarGame: React.FC<SpacewarGameProps> = ({ 
  onGameComplete, 
  onPlayAgain, 
  difficulty = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
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
    handleContinue,
    resetGame
  } = useSpacewarGame({ 
    canvasRef, 
    difficulty, 
    onGameComplete 
  });

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <GameInfo 
        showInstructions={showInstructions}
        winningScore={WINNING_SCORE}
        userScore={userScore}
        computerScore={computerScore}
      />
      
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
        />
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

export default SpacewarGame;
