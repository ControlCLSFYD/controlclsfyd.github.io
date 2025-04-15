
import { useState, useEffect } from 'react';
import { gameData } from '../data/gameData';

interface UseGameProgressProps {
  savedAnswers: Record<string, string>;
  revolvingQuestions: {[key: number]: number};
}

export const useGameProgress = ({ savedAnswers, revolvingQuestions }: UseGameProgressProps) => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [courtCompleted, setCourtCompleted] = useState(false);
  const [noughtsAndCrossesCompleted, setNoughtsAndCrossesCompleted] = useState(false);
  const [spacePeaceCompleted, setSpacePeaceCompleted] = useState(false);
  const [uatCompleted, setUATCompleted] = useState(false);
  const [snekCompleted, setSnekCompleted] = useState(false);
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
      
      if (newCompletedLevels.includes(1) && currentLevel >= 2 && !courtCompleted) {
        setCourtCompleted(true);
      }
      
      if (newCompletedLevels.includes(2) && currentLevel >= 3 && !spacePeaceCompleted) {
        setSpacePeaceCompleted(true);
      }
      
      if (newCompletedLevels.includes(3) && currentLevel >= 4 && !uatCompleted) {
        setUATCompleted(true);
      }
      
      if (newCompletedLevels.includes(4) && currentLevel >= 5 && !snekCompleted) {
        setSnekCompleted(true);
      }
      
      if (currentLevel >= 1 && !noughtsAndCrossesCompleted) {
        setNoughtsAndCrossesCompleted(true);
      }
    }
  }, [savedAnswers, currentLevel, courtCompleted, spacePeaceCompleted, uatCompleted, snekCompleted, noughtsAndCrossesCompleted, revolvingQuestions]);

  return {
    completedLevels,
    courtCompleted, setCourtCompleted,
    noughtsAndCrossesCompleted, setNoughtsAndCrossesCompleted,
    spacePeaceCompleted, setSpacePeaceCompleted,
    uatCompleted, setUATCompleted,
    snekCompleted, setSnekCompleted,
    currentLevel, setCurrentLevel
  };
};
