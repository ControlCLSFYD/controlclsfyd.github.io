
import { useState, useEffect } from 'react';
import { gameData } from '../data/gameData';

interface UseGameProgressProps {
  savedAnswers: Record<string, string>;
  revolvingQuestions: {[key: number]: number};
}

export const useGameProgress = ({ savedAnswers, revolvingQuestions }: UseGameProgressProps) => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [pongCompleted, setPongCompleted] = useState(false);
  const [oxoCompleted, setOxoCompleted] = useState(false);
  const [spacewarCompleted, setSpacewarCompleted] = useState(false);
  const [tetrisCompleted, setTetrisCompleted] = useState(false);
  const [snakeCompleted, setSnakeCompleted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    if (Object.keys(savedAnswers).length > 0) {
      const newCompletedLevels: number[] = [];
      
      gameData.levels.forEach((level, index) => {
        const levelNum = index + 1;
        const questionSet = level.questions[revolvingQuestions[levelNum] || 0];
        
        const allQuestionsAnswered = questionSet.every(question => {
          const answerKey = `${levelNum}-${question.id}`;
          const savedAnswer = savedAnswers[answerKey];
          return savedAnswer && savedAnswer.trim().toLowerCase() === question.answer.toLowerCase();
        });
        
        if (allQuestionsAnswered) {
          newCompletedLevels.push(levelNum);
        }
      });
      
      setCompletedLevels(newCompletedLevels);
      
      if (newCompletedLevels.includes(1) && currentLevel >= 2 && !pongCompleted) {
        setPongCompleted(true);
      }
      
      if (newCompletedLevels.includes(2) && currentLevel >= 3 && !spacewarCompleted) {
        setSpacewarCompleted(true);
      }
      
      if (newCompletedLevels.includes(3) && currentLevel >= 4 && !tetrisCompleted) {
        setTetrisCompleted(true);
      }
      
      if (newCompletedLevels.includes(4) && currentLevel >= 5 && !snakeCompleted) {
        setSnakeCompleted(true);
      }
      
      if (currentLevel >= 1 && !oxoCompleted) {
        setOxoCompleted(true);
      }
    }
  }, [savedAnswers, currentLevel, pongCompleted, spacewarCompleted, tetrisCompleted, snakeCompleted, oxoCompleted, revolvingQuestions]);

  return {
    completedLevels,
    pongCompleted, setPongCompleted,
    oxoCompleted, setOxoCompleted,
    spacewarCompleted, setSpacewarCompleted,
    tetrisCompleted, setTetrisCompleted,
    snakeCompleted, setSnakeCompleted,
    currentLevel, setCurrentLevel
  };
};
