
import React from 'react';
import GameLevel from './GameLevel';
import LoadingScreen from './LoadingScreen';
import GameCompletionScreen from './GameCompletionScreen';
import LevelCompletionScreen from './LevelCompletionScreen';
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
    showUATGame,
    showSnekGame,
    showMorseCodeGame,
    showMorseCodeAudioGame,
    currentLevel,
    isGameActive,
    showLevelCompleteScreen,
    completedLevel,
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    uatDifficulty,
    snekDifficulty,
    morseCodeDifficulty,
    morseCodeAudioDifficulty,
    handleAccessGranted,
    handleNoughtsAndCrossesComplete,
    handleNoughtsAndCrossesPlayAgain,
    handleCourtComplete,
    handleCourtPlayAgain,
    handleUATComplete,
    handleUATPlayAgain,
    handleSnekComplete,
    handleSnekPlayAgain,
    handleMorseCodeComplete,
    handleMorseCodePlayAgain,
    handleMorseCodeAudioComplete,
    handleMorseCodeAudioPlayAgain,
    handleLevelComplete,
    handleLevelContinue,
    handleEndMessageComplete,
    handleRestartGame,
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
          ) : showLevelCompleteScreen ? (
            <LevelCompletionScreen 
              level={completedLevel}
              onContinue={handleLevelContinue} 
            />
          ) : isGameActive ? (
            <GameHandler 
              showNoughtsAndCrossesGame={showNoughtsAndCrossesGame}
              showCourtGame={showCourtGame}
              showDuckHuntGame={false}
              showSpacewarGame={false}
              showUATGame={showUATGame}
              showSnekGame={showSnekGame}
              showMorseCodeGame={showMorseCodeGame}
              showMorseCodeAudioGame={showMorseCodeAudioGame}
              handleNoughtsAndCrossesComplete={handleNoughtsAndCrossesComplete}
              handleNoughtsAndCrossesPlayAgain={handleNoughtsAndCrossesPlayAgain}
              handleCourtComplete={handleCourtComplete}
              handleCourtPlayAgain={handleCourtPlayAgain}
              handleDuckHuntComplete={() => {}}
              handleDuckHuntPlayAgain={() => {}}
              handleSpacewarComplete={() => {}}
              handleSpacewarPlayAgain={() => {}}
              handleUATComplete={handleUATComplete}
              handleUATPlayAgain={handleUATPlayAgain}
              handleSnekComplete={handleSnekComplete}
              handleSnekPlayAgain={handleSnekPlayAgain}
              handleMorseCodeComplete={handleMorseCodeComplete}
              handleMorseCodePlayAgain={handleMorseCodePlayAgain}
              handleMorseCodeAudioComplete={handleMorseCodeAudioComplete}
              handleMorseCodeAudioPlayAgain={handleMorseCodeAudioPlayAgain}
              noughtsAndCrossesDifficulty={noughtsAndCrossesDifficulty}
              courtDifficulty={courtDifficulty}
              duckHuntDifficulty={1}
              spacewarDifficulty={1}
              uatDifficulty={uatDifficulty}
              snekDifficulty={snekDifficulty}
              morseCodeDifficulty={morseCodeDifficulty}
              morseCodeAudioDifficulty={morseCodeAudioDifficulty}
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
                onRestart={handleRestartGame}
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
