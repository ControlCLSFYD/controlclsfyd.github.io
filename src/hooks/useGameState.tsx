
import { useState, useEffect } from 'react';
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
  
  const [showCourtGame, setShowCourtGame] = useState(false);
  const [showNoughtsAndCrossesGame, setShowNoughtsAndCrossesGame] = useState(false);
  const [showDuckHuntGame, setShowDuckHuntGame] = useState(false);
  const [showUATGame, setShowUATGame] = useState(false);
  const [showSnekGame, setShowSnekGame] = useState(false);
  
  const { revolvingQuestions } = useRevolvingQuestions();
  
  const {
    completedLevels,
    courtCompleted, setCourtCompleted,
    noughtsAndCrossesCompleted, setNoughtsAndCrossesCompleted,
    duckHuntCompleted, setDuckHuntCompleted,
    uatCompleted, setUATCompleted,
    snekCompleted, setSnekCompleted,
    currentLevel, setCurrentLevel
  } = useGameProgress({ savedAnswers, revolvingQuestions });
  
  const {
    courtDifficulty, increaseCourtDifficulty,
    noughtsAndCrossesDifficulty, increaseNoughtsAndCrossesDifficulty,
    duckHuntDifficulty, increaseDuckHuntDifficulty,
    uatDifficulty, increaseUatDifficulty,
    snekDifficulty, increaseSnekDifficulty
  } = useGameDifficulty();

  const handleAccessGranted = () => {
    onResetGame();
    setGameStarted(true);
    setShowNoughtsAndCrossesGame(true);
  };

  const handleNoughtsAndCrossesComplete = () => {
    setNoughtsAndCrossesCompleted(true);
    setShowNoughtsAndCrossesGame(false);
    setCurrentLevel(1);
  };

  const handleNoughtsAndCrossesPlayAgain = () => {
    increaseNoughtsAndCrossesDifficulty();
    setShowNoughtsAndCrossesGame(true);
  };

  const handleLevelComplete = () => {
    if (currentLevel === 1 && !courtCompleted) {
      setShowCourtGame(true);
    } 
    else if (currentLevel === 2 && !duckHuntCompleted) {
      setShowDuckHuntGame(true);
    }
    else if (currentLevel === 3 && !uatCompleted) {
      setShowUATGame(true);
    }
    else if (currentLevel === 4 && !snekCompleted) {
      setShowSnekGame(true);
    }
    else if (currentLevel < gameData.levels.length) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
    } else {
      setGameCompleted(true);
    }
  };

  const handleCourtComplete = () => {
    setCourtCompleted(true);
    setShowCourtGame(false);
    setCurrentLevel(2);
  };

  const handleCourtPlayAgain = (playerWon: boolean) => {
    if (playerWon) {
      increaseCourtDifficulty();
    }
    setShowCourtGame(true);
  };

  const handleDuckHuntComplete = () => {
    setDuckHuntCompleted(true);
    setShowDuckHuntGame(false);
    setCurrentLevel(3);
  };

  const handleDuckHuntPlayAgain = () => {
    increaseDuckHuntDifficulty();
    setShowDuckHuntGame(true);
  };

  const handleUATComplete = () => {
    setUATCompleted(true);
    setShowUATGame(false);
    setCurrentLevel(4);
  };

  const handleUATPlayAgain = () => {
    increaseUatDifficulty();
    setShowUATGame(true);
  };

  const handleSnekComplete = () => {
    setSnekCompleted(true);
    setShowSnekGame(false);
    setCurrentLevel(5);
  };

  const handleSnekPlayAgain = () => {
    increaseSnekDifficulty();
    setShowSnekGame(true);
  };

  const handleEndMessageComplete = () => {
    setShowEndScreenPsalm(false);
  };

  const isGameActive = showCourtGame || showNoughtsAndCrossesGame || showDuckHuntGame || showUATGame || showSnekGame;

  const getCurrentLevelQuestions = () => {
    return getCurrentQuestions(currentLevel, gameData.levels, revolvingQuestions);
  };

  const getCurrentLevelImage = () => {
    return getCurrentImageSrc(currentLevel, gameData.levels, revolvingQuestions);
  };

  return {
    gameStarted,
    gameCompleted,
    showNoughtsAndCrossesGame,
    showCourtGame,
    showDuckHuntGame,
    showUATGame,
    showSnekGame,
    currentLevel,
    isGameActive,
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    duckHuntDifficulty,
    uatDifficulty,
    snekDifficulty,
    handleAccessGranted,
    handleNoughtsAndCrossesComplete,
    handleNoughtsAndCrossesPlayAgain,
    handleCourtComplete,
    handleCourtPlayAgain,
    handleDuckHuntComplete,
    handleDuckHuntPlayAgain,
    handleUATComplete,
    handleUATPlayAgain,
    handleSnekComplete,
    handleSnekPlayAgain,
    handleLevelComplete,
    handleEndMessageComplete,
    getCurrentLevelQuestions,
    getCurrentLevelImage
  };
};
