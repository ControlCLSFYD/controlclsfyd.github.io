import React, { useState } from 'react';
import GameLevel from './GameLevel';
import TypewriterText from './TypewriterText';
import PongGame from './PongGame';
import OxoGame from './OxoGame';
import SpacewarGame from './SpacewarGame';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import LessonScreen from './LessonScreen';
import LoadingScreen from './LoadingScreen';
import GameCompletionScreen from './GameCompletionScreen';
import PyramidStamp from './PyramidStamp';
import { useGameProgress } from '../hooks/useGameProgress';
import { useRevolvingQuestions } from '../hooks/useRevolvingQuestions';
import { useGameDifficulty } from '../hooks/useGameDifficulty';
import { getCurrentImageSrc, getCurrentQuestions } from '../utils/gameHelpers';
import { gameData, lessonData } from '../data/gameData';

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
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showEndScreenPsalm, setShowEndScreenPsalm] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  
  const [showPongGame, setShowPongGame] = useState(false);
  const [showOxoGame, setShowOxoGame] = useState(false);
  const [showSpacewarGame, setShowSpacewarGame] = useState(false);
  const [showTetrisGame, setShowTetrisGame] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  
  const { revolvingQuestions } = useRevolvingQuestions();
  
  const {
    completedLevels,
    pongCompleted, setPongCompleted,
    oxoCompleted, setOxoCompleted,
    spacewarCompleted, setSpacewarCompleted,
    tetrisCompleted, setTetrisCompleted,
    snakeCompleted, setSnakeCompleted,
    currentLevel, setCurrentLevel
  } = useGameProgress({ savedAnswers, revolvingQuestions });
  
  const {
    pongDifficulty, increasePongDifficulty,
    oxoDifficulty, increaseOxoDifficulty,
    spacewarDifficulty, increaseSpacewarDifficulty,
    tetrisDifficulty, increaseTetrisDifficulty,
    snakeDifficulty, increaseSnakeDifficulty
  } = useGameDifficulty();

  const handleAccessGranted = () => {
    onResetGame();
    setGameStarted(true);
    setShowOxoGame(true);
  };

  const handleOxoComplete = () => {
    setOxoCompleted(true);
    setShowOxoGame(false);
    
    if (gameData.levels[0]?.hasLesson) {
      setCurrentLesson(1);
      setShowLesson(true);
    } else {
      setCurrentLevel(1);
    }
  };

  const handleOxoPlayAgain = () => {
    increaseOxoDifficulty();
    setShowOxoGame(true);
  };

  const handleLevelComplete = () => {
    if (!completedLevels.includes(currentLevel)) {
      // Current implementation keeps this logic inside useGameProgress hook
    }
    
    if (currentLevel === 1 && !pongCompleted) {
      setShowPongGame(true);
    } 
    else if (currentLevel === 2 && !spacewarCompleted) {
      setShowSpacewarGame(true);
    }
    else if (currentLevel === 3 && !tetrisCompleted) {
      setShowTetrisGame(true);
    }
    else if (currentLevel === 4 && !snakeCompleted) {
      setShowSnakeGame(true);
    }
    else if (currentLevel < gameData.levels.length) {
      const nextLevel = currentLevel + 1;
      
      if (nextLevel <= gameData.levels.length && gameData.levels[nextLevel - 1]?.hasLesson) {
        setCurrentLesson(nextLevel);
        setShowLesson(true);
      } else {
        setCurrentLevel(nextLevel);
      }
    } else {
      setGameCompleted(true);
    }
  };

  const handlePongComplete = () => {
    setPongCompleted(true);
    setShowPongGame(false);
    
    if (gameData.levels[1]?.hasLesson) {
      setCurrentLesson(2);
      setShowLesson(true);
    } else {
      setCurrentLevel(2);
    }
  };

  const handlePongPlayAgain = (playerWon: boolean) => {
    if (playerWon) {
      increasePongDifficulty();
    }
    setShowPongGame(true);
  };

  const handleSpacewarComplete = () => {
    setSpacewarCompleted(true);
    setShowSpacewarGame(false);
    setCurrentLevel(3);
  };

  const handleSpacewarPlayAgain = () => {
    increaseSpacewarDifficulty();
    setShowSpacewarGame(true);
  };

  const handleTetrisComplete = () => {
    setTetrisCompleted(true);
    setShowTetrisGame(false);
    setCurrentLevel(4);
  };

  const handleTetrisPlayAgain = () => {
    increaseTetrisDifficulty();
    setShowTetrisGame(true);
  };

  const handleSnakeComplete = () => {
    setSnakeCompleted(true);
    setShowSnakeGame(false);
    setCurrentLevel(5);
  };

  const handleSnakePlayAgain = () => {
    increaseSnakeDifficulty();
    setShowSnakeGame(true);
  };

  const handleLessonComplete = () => {
    setShowLesson(false);
    setCurrentLevel(currentLesson);
  };

  const handleEndMessageComplete = () => {
    setShowEndScreenPsalm(false);
  };

  const isGameActive = showPongGame || showOxoGame || showSpacewarGame || showTetrisGame || showSnakeGame;

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
              lesson={lessonData.find(lesson => lesson.id === currentLesson) || lessonData[0]} 
              onComplete={handleLessonComplete} 
            />
          ) : showOxoGame ? (
            <OxoGame 
              onGameComplete={handleOxoComplete} 
              onPlayAgain={handleOxoPlayAgain} 
              difficulty={oxoDifficulty}
            />
          ) : showPongGame ? (
            <PongGame 
              onGameComplete={handlePongComplete} 
              onPlayAgain={handlePongPlayAgain}
              difficulty={pongDifficulty}
            />
          ) : showSpacewarGame ? (
            <SpacewarGame 
              onGameComplete={handleSpacewarComplete} 
              onPlayAgain={handleSpacewarPlayAgain}
              difficulty={spacewarDifficulty}
            />
          ) : showTetrisGame ? (
            <TetrisGame 
              onGameComplete={handleTetrisComplete} 
              onPlayAgain={handleTetrisPlayAgain}
              difficulty={tetrisDifficulty}
            />
          ) : showSnakeGame ? (
            <SnakeGame 
              onGameComplete={handleSnakeComplete} 
              onPlayAgain={handleSnakePlayAgain}
              difficulty={snakeDifficulty}
            />
          ) : (
            currentLevel > 0 && currentLevel <= gameData.levels.length && (
              <GameLevel
                key={currentLevel}
                level={currentLevel}
                questions={getCurrentQuestions(currentLevel, gameData.levels, revolvingQuestions)}
                imageSrc={getCurrentImageSrc(currentLevel, gameData.levels, revolvingQuestions)}
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
