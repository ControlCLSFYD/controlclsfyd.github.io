
import React from 'react';
import LessonModal from './LessonModal';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { LessonContent } from './LessonScreen';

interface GameActionsProps {
  lesson: LessonContent;
  hasImage: boolean;
  onReloadImage: () => void;
}

const GameActions: React.FC<GameActionsProps> = ({ lesson, hasImage, onReloadImage }) => {
  return (
    <div className="mt-4 flex flex-col items-center">
      {/* Investi Gator Help Button */}
      <LessonModal lesson={lesson} />
      
      {/* Reload Image Button */}
      {hasImage && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onReloadImage}
          className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
        >
          <RefreshCw size={16} />
          Reload Image
        </Button>
      )}
    </div>
  );
};

export default GameActions;
