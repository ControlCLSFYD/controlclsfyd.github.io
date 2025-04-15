
import React from 'react';
import GameLevel from './GameLevel';
import LoadingScreen from './LoadingScreen';
import GameCompletionScreen from './GameCompletionScreen';
import { useGameState } from '../hooks/useGameState';
import GameHandler from './games/GameHandler';

interface GameContainerProps {
  savedAnswers: Record<string, string>;
  onAnswerUpdate: (levelId: number, questionId: string, answer: string) => void;
  onResetGame: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ 
  savedAnswers, 
  onAnswerUpdate,
  onResetGame
}) => {
  const gameState = useGameState({ savedAnswers, onResetGame });
  
  const {
    gameStarted,
    gameCompleted,
    showOxoGame,
    showPongGame,
    showSpacewarGame,
    showTetrisGame,
    showSnakeGame,
    currentLevel,
    isGameActive,
    oxoDifficulty,
    pongDifficulty,
    spacewarDifficulty,
    tetrisDifficulty,
    snakeDifficulty,
    handleAccessGranted,
    handleOxoComplete,
    handleOxoPlayAgain,
    handlePongComplete,
    handlePongPlayAgain,
    handleSpacewarComplete,
    handleSpacewarPlayAgain,
    handleTetrisComplete,
    handleTetrisPlayAgain,
    handleSnakeComplete,
    handleSnakePlayAgain,
    handleLevelComplete,
    handleEndMessageComplete,
    getCurrentLevelQuestions,
    getCurrentLevelImage
  } = gameState;

  return (
    <div className="terminal p-4 vhs-screen">
      {!gameStarted ? (
        <LoadingScreen onAccessGranted={handleAccessGranted} />
      ) : (
        <div>
          {gameCompleted ? (
            <GameCompletionScreen onComplete={handleEndMessageComplete} />
          ) : isGameActive ? (
            <GameHandler 
              showOxoGame={showOxoGame}
              showPongGame={showPongGame}
              showSpacewarGame={showSpacewarGame}
              showTetrisGame={showTetrisGame}
              showSnakeGame={showSnakeGame}
              handleOxoComplete={handleOxoComplete}
              handleOxoPlayAgain={handleOxoPlayAgain}
              handlePongComplete={handlePongComplete}
              handlePongPlayAgain={handlePongPlayAgain}
              handleSpacewarComplete={handleSpacewarComplete}
              handleSpacewarPlayAgain={handleSpacewarPlayAgain}
              handleTetrisComplete={handleTetrisComplete}
              handleTetrisPlayAgain={handleTetrisPlayAgain}
              handleSnakeComplete={handleSnakeComplete}
              handleSnakePlayAgain={handleSnakePlayAgain}
              oxoDifficulty={oxoDifficulty}
              pongDifficulty={pongDifficulty}
              spacewarDifficulty={spacewarDifficulty}
              tetrisDifficulty={tetrisDifficulty}
              snakeDifficulty={snakeDifficulty}
            />
          ) : (
            currentLevel > 0 && (
              <GameLevel
                key={currentLevel}
                level={currentLevel}
                questions={getCurrentLevelQuestions()}
                imageSrc={getCurrentLevelImage()}
                isActive={true}
                onLevelComplete={handleLevelComplete}
                savedAnswers={savedAnswers}
                onAnswerUpdate={onAnswerUpdate}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
