
import React from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import LessonModal from '../LessonModal';
import { LessonContent } from '../LessonScreen';

interface GameControlsProps {
  imageSrc?: string;
  handleReloadImage?: () => void;
  levelLesson: LessonContent;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  imageSrc, 
  handleReloadImage,
  levelLesson 
}) => {
  return (
    <div className="mt-4 flex flex-col items-center">
      {/* Investi Gator Help Button */}
      <LessonModal lesson={levelLesson} />
      
      {/* Reload Image Button */}
      {imageSrc && handleReloadImage && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReloadImage}
          className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
        >
          <RefreshCw size={16} />
          Reload Image
        </Button>
      )}
    </div>
  );
};

export default GameControls;
