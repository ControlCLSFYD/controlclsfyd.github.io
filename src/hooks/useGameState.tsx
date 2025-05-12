
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
  const [showMorseCodeGame, setShowMorseCodeGame] = useState(false);
  const [showMorseCodeAudioGame, setShowMorseCodeAudioGame] = useState(false);
  
  const { revolvingQuestions } = useRevolvingQuestions();
  
  const {
    completedLevels,
    courtCompleted, setCourtCompleted,
    noughtsAndCrossesCompleted, setNoughtsAndCrossesCompleted,
    duckHuntCompleted, setDuckHuntCompleted,
    spacewarCompleted, setSpacewarCompleted,
    uatCompleted, setUATCompleted,
    snekCompleted, setSnekCompleted,
    morseCodeCompleted, setMorseCodeCompleted,
    morseCodeAudioCompleted, setMorseCodeAudioCompleted,
    currentLevel, setCurrentLevel
  } = useGameProgress({ savedAnswers, revolvingQuestions });
  
  const {
    courtDifficulty, increaseCourtDifficulty,
    noughtsAndCrossesDifficulty, increaseNoughtsAndCrossesDifficulty,
    duckHuntDifficulty, increaseDuckHuntDifficulty,
    spacewarDifficulty, increaseSpacewarDifficulty,
    uatDifficulty, increaseUatDifficulty,
    snekDifficulty, increaseSnekDifficulty,
    morseCodeDifficulty, increaseMorseCodeDifficulty,
    morseCodeAudioDifficulty, increaseMorseCodeAudioDifficulty
  } = useGameDifficulty();

  const handleAccessGranted = () => {
    onResetGame();
    setGameStarted(true);
    setShowNoughtsAndCrossesGame(true);
  };

  const handleNoughtsAndCrossesComplete = () => {
    setNoughtsAndCrossesCompleted(true);
    setShowNoughtsAndCrossesGame(false);
    // After Noughts and Crosses, show the Morse Code game
    setShowMorseCodeGame(true);
  };

  const handleNoughtsAndCrossesPlayAgain = () => {
    increaseNoughtsAndCrossesDifficulty();
    setShowNoughtsAndCrossesGame(true);
  };

  const handleMorseCodeComplete = () => {
    setMorseCodeCompleted(true);
    setShowMorseCodeGame(false);
    // After Morse Code game, go to level 1
    setCurrentLevel(1);
  };

  const handleMorseCodePlayAgain = () => {
    increaseMorseCodeDifficulty();
    setShowMorseCodeGame(true);
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
    else if (currentLevel === 2 && !uatCompleted) {
      // Skip Spacewar game, go straight to UAT game after level 2
      setShowUATGame(true);
    }
    else if (currentLevel === 3 && !snekCompleted) {
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
    // After Court game, show the Morse Code Audio game
    setShowMorseCodeAudioGame(true);
  };

  const handleCourtPlayAgain = (playerWon: boolean) => {
    if (playerWon) {
      increaseCourtDifficulty();
    }
    setShowCourtGame(true);
  };
  
  const handleMorseCodeAudioComplete = () => {
    setMorseCodeAudioCompleted(true);
    setShowMorseCodeAudioGame(false);
    // After Morse Code Audio game, go to level 2
    setCurrentLevel(2);
  };

  const handleMorseCodeAudioPlayAgain = () => {
    increaseMorseCodeAudioDifficulty();
    setShowMorseCodeAudioGame(true);
  };

  const handleUATComplete = () => {
    setUATCompleted(true);
    setShowUATGame(false);
    setCurrentLevel(3);
  };

  const handleUATPlayAgain = () => {
    increaseUatDifficulty();
    setShowUATGame(true);
  };

  const handleSnekComplete = () => {
    setSnekCompleted(true);
    setShowSnekGame(false);
    setCurrentLevel(4);
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

  // Update isGameActive to include morse code audio game
  const isGameActive = showCourtGame || showNoughtsAndCrossesGame || showUATGame || showSnekGame || showMorseCodeGame || showMorseCodeAudioGame;

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
  };
};
