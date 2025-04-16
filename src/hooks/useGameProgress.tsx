
import { useState, useEffect } from 'react';
import { gameData } from '../data/gameData';

interface UseGameProgressProps {
  savedAnswers: Record<string, string>;
  revolvingQuestions: {[key: number]: number};
}

export const useGameProgress = ({ savedAnswers, revolvingQuestions }: UseGameProgressProps) => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  
  const [noughtsAndCrossesCompleted, setNoughtsAndCrossesCompleted] = useState(false);
  const [courtCompleted, setCourtCompleted] = useState(false);
  const [duckHuntCompleted, setDuckHuntCompleted] = useState(false);
  const [spacePeaceCompleted, setSpacePeaceCompleted] = useState(false);
  const [uatCompleted, setUATCompleted] = useState(false);
  const [snekCompleted, setSnekCompleted] = useState(false);
  
  // Check for completed levels based on saved answers
  useEffect(() => {
    // Function to check if a level is completed
    const isLevelCompleted = (levelId: number): boolean => {
      // Get questions for this level
      const levelIndex = levelId - 1;
      if (levelIndex < 0 || levelIndex >= gameData.levels.length) return false;
      
      const level = gameData.levels[levelIndex];
      const questionSet = level.questions[revolvingQuestions[levelId] || 0];
      
      // If there are no questions, level is not completed
      if (!questionSet || questionSet.length === 0) return false;
      
      // Check if all questions have answers
      for (const question of questionSet) {
        const answerKey = `${levelId}-${question.id}`;
        if (!savedAnswers[answerKey]) {
          return false;
        }
      }
      
      return true;
    };
    
    // Update completed levels
    const newCompletedLevels = [];
    for (let i = 1; i <= gameData.levels.length; i++) {
      if (isLevelCompleted(i)) {
        newCompletedLevels.push(i);
      }
    }
    
    setCompletedLevels(newCompletedLevels);
    
    // Determine current level if not already playing one
    if (currentLevel === 0) {
      // Find the first uncompleted level
      for (let i = 1; i <= gameData.levels.length; i++) {
        if (!newCompletedLevels.includes(i)) {
          setCurrentLevel(i);
          break;
        }
      }
    }
  }, [savedAnswers, revolvingQuestions, currentLevel]);
  
  return {
    completedLevels,
    currentLevel,
    setCurrentLevel,
    noughtsAndCrossesCompleted,
    setNoughtsAndCrossesCompleted,
    courtCompleted,
    setCourtCompleted,
    duckHuntCompleted,
    setDuckHuntCompleted,
    spacePeaceCompleted,
    setSpacePeaceCompleted,
    uatCompleted,
    setUATCompleted,
    snekCompleted,
    setSnekCompleted
  };
};
