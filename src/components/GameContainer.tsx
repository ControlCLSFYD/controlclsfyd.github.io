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
    showNoughtsAndCrossesGame,
    showCourtGame,
    showSpacePeaceGame,
    showUATGame,
    showSnekGame,
    currentLevel,
    isGameActive,
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    spacePeaceDifficulty,
    uatDifficulty,
    snekDifficulty,
    handleAccessGranted,
    handleNoughtsAndCrossesComplete,
    handleNoughtsAndCrossesPlayAgain,
    handleCourtComplete,
    handleCourtPlayAgain,
    handleSpacePeaceComplete,
    handleSpacePeacePlayAgain,
    handleUATComplete,
    handleUATPlayAgain,
    handleSnekComplete,
    handleSnekPlayAgain,
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
              showNoughtsAndCrossesGame={showNoughtsAndCrossesGame}
              showCourtGame={showCourtGame}
              showSpacePeaceGame={showSpacePeaceGame}
              showUATGame={showUATGame}
              showSnekGame={showSnekGame}
              handleNoughtsAndCrossesComplete={handleNoughtsAndCrossesComplete}
              handleNoughtsAndCrossesPlayAgain={handleNoughtsAndCrossesPlayAgain}
              handleCourtComplete={handleCourtComplete}
              handleCourtPlayAgain={handleCourtPlayAgain}
              handleSpacePeaceComplete={handleSpacePeaceComplete}
              handleSpacePeacePlayAgain={handleSpacePeacePlayAgain}
              handleUATComplete={handleUATComplete}
              handleUATPlayAgain={handleUATPlayAgain}
              handleSnekComplete={handleSnekComplete}
              handleSnekPlayAgain={handleSnekPlayAgain}
              noughtsAndCrossesDifficulty={noughtsAndCrossesDifficulty}
              courtDifficulty={courtDifficulty}
              spacePeaceDifficulty={spacePeaceDifficulty}
              uatDifficulty={uatDifficulty}
              snekDifficulty={snekDifficulty}
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
