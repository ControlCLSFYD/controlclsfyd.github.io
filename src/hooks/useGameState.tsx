
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
  const [showLevelCompleteScreen, setShowLevelCompleteScreen] = useState(false);
  const [completedLevel, setCompletedLevel] = useState(0);
  
  const [showCourtGame, setShowCourtGame] = useState(false);
  const [showNoughtsAndCrossesGame, setShowNoughtsAndCrossesGame] = useState(false);
  const [showUATGame, setShowUATGame] = useState(false);
  const [showSnekGame, setShowSnekGame] = useState(false);
  const [showSpacePeaceGame, setShowSpacePeaceGame] = useState(false);
  
  const { revolvingQuestions } = useRevolvingQuestions();
  
  const {
    completedLevels,
    courtCompleted, setCourtCompleted,
    noughtsAndCrossesCompleted, setNoughtsAndCrossesCompleted,
    duckHuntCompleted, setDuckHuntCompleted,
    spacePeaceCompleted, setSpacePeaceCompleted,
    uatCompleted, setUATCompleted,
    snekCompleted, setSnekCompleted,
    currentLevel, setCurrentLevel
  } = useGameProgress({ savedAnswers, revolvingQuestions });
  
  const {
    courtDifficulty, increaseCourtDifficulty,
    noughtsAndCrossesDifficulty, increaseNoughtsAndCrossesDifficulty,
    duckHuntDifficulty, increaseDuckHuntDifficulty,
    spacePeaceDifficulty, increaseSpacePeaceDifficulty,
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
    // Show level completion screen first
    setCompletedLevel(currentLevel);
    setShowLevelCompleteScreen(true);
  };
  
  const handleLevelContinue = () => {
    setShowLevelCompleteScreen(false);
    
    // Now handle the actual level progression
    if (currentLevel === 1 && !courtCompleted) {
      setShowCourtGame(true);
    } 
    else if (currentLevel === 2 && !spacePeaceCompleted) {
      setShowSpacePeaceGame(true);
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

  const handleSpacePeaceComplete = () => {
    setSpacePeaceCompleted(true);
    setShowSpacePeaceGame(false);
    setCurrentLevel(3);
  };

  const handleSpacePeacePlayAgain = (playerWon: boolean) => {
    if (playerWon) {
      increaseSpacePeaceDifficulty();
    }
    setShowSpacePeaceGame(true);
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
  
  const handleRestartGame = () => {
    // Reset the game state
    onResetGame();
    setGameStarted(true);
    setShowNoughtsAndCrossesGame(true);
  };

  const isGameActive = showCourtGame || showNoughtsAndCrossesGame || showUATGame || showSnekGame || showSpacePeaceGame;

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
    showSpacePeaceGame,
    showUATGame,
    showSnekGame,
    currentLevel,
    isGameActive,
    showLevelCompleteScreen,
    completedLevel,
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
    handleLevelContinue,
    handleEndMessageComplete,
    handleRestartGame,
    getCurrentLevelQuestions,
    getCurrentLevelImage
  };
};
