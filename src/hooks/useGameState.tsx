
import { useState } from 'react';
import { useGameProgress } from './useGameProgress';
import { useRevolvingQuestions } from './useRevolvingQuestions';
import { useGameDifficulty } from './useGameDifficulty';
import { getCurrentImageSrc, getCurrentQuestions } from '../utils/gameHelpers';
import { gameData } from '../data/gameData';

interface UseGameStateProps {
  savedAnswers: Record<string, string>;
  onResetGame: () => void;
}

export const useGameState = ({ savedAnswers, onResetGame }: UseGameStateProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showEndScreenPsalm, setShowEndScreenPsalm] = useState(false);
  
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
    setCurrentLevel(1);
  };

  const handleOxoPlayAgain = () => {
    increaseOxoDifficulty();
    setShowOxoGame(true);
  };

  const handleLevelComplete = () => {
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
      setCurrentLevel(nextLevel);
    } else {
      setGameCompleted(true);
    }
  };

  const handlePongComplete = () => {
    setPongCompleted(true);
    setShowPongGame(false);
    setCurrentLevel(2);
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

  const handleEndMessageComplete = () => {
    setShowEndScreenPsalm(false);
  };

  const isGameActive = showPongGame || showOxoGame || showSpacewarGame || showTetrisGame || showSnakeGame;

  const getCurrentLevelQuestions = () => {
    return getCurrentQuestions(currentLevel, gameData.levels, revolvingQuestions);
  };

  const getCurrentLevelImage = () => {
    return getCurrentImageSrc(currentLevel, gameData.levels, revolvingQuestions);
  };

  return {
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
  };
};
