import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { Question } from '../components/GameLevel';
import { lessonData } from '../data/gameData';

interface UseGameStateProps {
  savedAnswers: Record<string, string>;
  onResetGame: () => void;
}

export const useGameState = ({ savedAnswers, onResetGame }: UseGameStateProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showNoughtsAndCrossesGame, setShowNoughtsAndCrossesGame] = useState(false);
  const [showCourtGame, setShowCourtGame] = useState(false);
  const [showPongGame, setShowPongGame] = useState(false);
  const [showUATGame, setShowUATGame] = useState(false);
  const [showSnekGame, setShowSnekGame] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [noughtsAndCrossesDifficulty, setNoughtsAndCrossesDifficulty] = useState(1);
  const [courtDifficulty, setCourtDifficulty] = useState(1);
  const [pongDifficulty, setPongDifficulty] = useState(1);
  const [uatDifficulty, setUATDifficulty] = useState(1);
  const [snekDifficulty, setSnekDifficulty] = useState(1);
  const { toast } = useToast()

  const handleAccessGranted = useCallback(() => {
    setGameStarted(true);
    setCurrentLevel(1);
    setIsGameActive(true);
  }, []);

  const handleNoughtsAndCrossesComplete = useCallback(() => {
    setShowNoughtsAndCrossesGame(false);
    
    handleLevelComplete();
  }, []);
  
  const handleNoughtsAndCrossesPlayAgain = useCallback(() => {
    
  }, []);

  const handleCourtComplete = useCallback(() => {
    setShowCourtGame(false);
    handleLevelComplete();
  }, []);
  
  const handleCourtPlayAgain = useCallback(() => {
    
  }, []);

  const handlePongComplete = useCallback(() => {
    setShowPongGame(false);
    
    handleLevelComplete();
  }, []);
  
  const handlePongPlayAgain = useCallback(() => {
    
  }, []);

  const handleUATComplete = useCallback(() => {
    setShowUATGame(false);
    handleLevelComplete();
  }, []);
  
  const handleUATPlayAgain = useCallback(() => {
    
  }, []);

  const handleSnekComplete = useCallback(() => {
    setShowSnekGame(false);
    handleLevelComplete();
  }, []);
  
  const handleSnekPlayAgain = useCallback(() => {
    
  }, []);

  const handleLevelComplete = useCallback(() => {
    setIsGameActive(false);
    setCurrentLevel(prevLevel => prevLevel + 1);
    
    // Check if the game is completed
    if (currentLevel >= lessonData.length) {
      setGameCompleted(true);
    }
  }, [currentLevel]);

  const handleEndMessageComplete = useCallback(() => {
    // Reset the game state
    setGameCompleted(false);
    setGameStarted(false);
    setCurrentLevel(0);
    setIsGameActive(false);
    onResetGame();
    
    toast({
      title: "Game Completed!",
      description: "Thanks for playing!",
    })
  }, [onResetGame, toast]);

  const getCurrentLevelQuestions = (): Question[] => {
    const currentLesson = lessonData.find(lesson => lesson.id === currentLevel);
    
    if (!currentLesson || !currentLesson.levels || currentLesson.levels.length === 0) {
      return [];
    }
    
    // Use the first level's questions as default
    let questions = currentLesson.levels[0].questions;
    
    // Check if there are multiple sets of questions
    if (currentLesson.levels.length > 1) {
      // Determine which set of questions to use based on a simple cycling logic
      const questionSetIndex = (currentLevel - 1) % currentLesson.levels.length;
      questions = currentLesson.levels[questionSetIndex].questions;
    }
    
    return questions;
  };

  const getCurrentLevelImage = (): string | undefined => {
    const currentLesson = lessonData.find(lesson => lesson.id === currentLevel);
    
    if (!currentLesson || !currentLesson.levels || currentLesson.levels.length === 0) {
      return undefined;
    }
    
    // Use the first level's image as default
    let imageSrc = currentLesson.levels[0].imageSrc;
    
    if (Array.isArray(imageSrc)) {
      // Determine which image to use based on a simple cycling logic
      const imageIndex = (currentLevel - 1) % imageSrc.length;
      return imageSrc[imageIndex];
    }
    
    return imageSrc;
  };

  return {
    gameStarted,
    gameCompleted,
    showNoughtsAndCrossesGame,
    showCourtGame,
    showPongGame,
    showUATGame,
    showSnekGame,
    currentLevel,
    isGameActive,
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    pongDifficulty,
    uatDifficulty,
    snekDifficulty,
    handleAccessGranted,
    handleNoughtsAndCrossesComplete,
    handleNoughtsAndCrossesPlayAgain,
    handleCourtComplete,
    handleCourtPlayAgain,
    handlePongComplete,
    handlePongPlayAgain,
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
