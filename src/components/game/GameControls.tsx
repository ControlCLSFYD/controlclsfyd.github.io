
import React from 'react';
import LessonModal from '../LessonModal';
import { LessonContent } from '../LessonScreen';

interface GameControlsProps {
  imageSrc?: string;
  levelLesson: LessonContent;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  imageSrc, 
  levelLesson 
}) => {
  return (
    <div className="mt-4 flex flex-col items-center">
      {/* Investi Gator Help Button */}
      <LessonModal lesson={levelLesson} />
    </div>
  );
};

export default GameControls;
