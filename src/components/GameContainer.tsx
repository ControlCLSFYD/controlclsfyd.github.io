
import React from 'react';
import GameLevel from './GameLevel';
import LessonScreen from './LessonScreen';
import LoadingScreen from './LoadingScreen';
import GameCompletionScreen from './GameCompletionScreen';
import PyramidStamp from './PyramidStamp';
import { useGameState } from '../hooks/useGameState';
import GameHandler from './games/GameHandler';
import { lessonData } from '../data/gameData';

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
    showLesson,
    currentLesson,
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
    handleLessonComplete,
    handleEndMessageComplete,
    getCurrentLevelQuestions,
    getCurrentLevelImage
  } = gameState;

  return (
    <div className="terminal p-4">
      {!gameStarted ? (
        <LoadingScreen onAccessGranted={handleAccessGranted} />
      ) : (
        <div>
          {gameCompleted ? (
            <GameCompletionScreen onComplete={handleEndMessageComplete} />
          ) : showLesson ? (
            <LessonScreen 
              lesson={currentLesson ? 
                lessonData.find(lesson => lesson.id === currentLesson) || lessonData[0] : 
                lessonData[0]} 
              onComplete={handleLessonComplete} 
            />
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
          
          <PyramidStamp />
        </div>
      )}
    </div>
  );
};

export default GameContainer;
