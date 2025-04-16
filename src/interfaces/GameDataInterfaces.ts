
import { Question } from '../components/GameLevel';
import { LessonContent } from '../components/LessonScreen';

export interface Level {
  id: number;
  questions: Question[][];  // Array of question sets (for revolving questions)
  currentQuestionSet?: number; // Index of the current question set
  imageSrc?: string | string[];  // String or array of strings for revolving images
  hasLesson?: boolean;  // Whether this level has a lesson before it
}

export interface GameData {
  levels: Level[];
  lessons: LessonContent[];
}
