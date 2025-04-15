
import { Level } from '../data/gameData';

export const getCurrentImageSrc = (level: number, levelData: Level[], revolvingQuestions: {[key: number]: number}) => {
  const levelInfo = levelData[level - 1];
  if (!levelInfo) return undefined;
  
  if (Array.isArray(levelInfo.imageSrc)) {
    const questionIndex = revolvingQuestions[level] || 0;
    return levelInfo.imageSrc[questionIndex];
  }
  
  return levelInfo.imageSrc;
};

export const getCurrentQuestions = (level: number, levelData: Level[], revolvingQuestions: {[key: number]: number}) => {
  const levelInfo = levelData[level - 1];
  if (!levelInfo) return [];
  
  const questionIndex = revolvingQuestions[level] || 0;
  return levelInfo.questions[questionIndex] || [];
};
