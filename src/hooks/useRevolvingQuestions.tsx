
import { useState, useEffect } from 'react';
import { gameData } from '../data/gameData';

export const useRevolvingQuestions = () => {
  const [revolvingQuestions, setRevolvingQuestions] = useState<{[key: number]: number}>({});
  
  useEffect(() => {
    const initialRevolvingState: {[key: number]: number} = {};
    gameData.levels.forEach(level => {
      if (level.questions.length > 1) {
        // Ensure truly random selection from all available question sets
        initialRevolvingState[level.id] = Math.floor(Math.random() * level.questions.length);
      } else {
        initialRevolvingState[level.id] = 0;
      }
    });
    setRevolvingQuestions(initialRevolvingState);
  }, []);
  
  return { revolvingQuestions };
};
