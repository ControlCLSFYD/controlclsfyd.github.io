
import { GameData } from '../interfaces/GameDataInterfaces';
import { lessonData } from './lessonData';
import { levelOneData } from './levelOneData';
import { levelTwoData } from './levelTwoData';
import { levelThreeData } from './levelThreeData';
import { levelFourData } from './levelFourData';
import { levelFiveData } from './levelFiveData';

// Game levels array
export const gameLevels = [
  levelOneData,
  levelTwoData,
  levelThreeData,
  levelFourData,
  levelFiveData
];

// Export both lessons and levels
export const gameData: GameData = {
  levels: gameLevels,
  lessons: lessonData
};

// Re-export lessonData so it can be imported directly from gameData
export { lessonData };

// Re-export types from the interface file for backward compatibility
export type { Level, GameData } from '../interfaces/GameDataInterfaces';
