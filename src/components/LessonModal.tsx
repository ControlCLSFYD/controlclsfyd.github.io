
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import LessonScreen from './LessonScreen';
import { LessonContent } from './LessonScreen';
import { HelpCircle } from 'lucide-react';

interface LessonModalProps {
  lesson: LessonContent;
  levelId: number;
}

const LessonModal: React.FC<LessonModalProps> = ({ lesson, levelId }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleComplete = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
        >
          <HelpCircle size={16} />
          Investi Gator Help
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[90vw] max-w-[800px] border-terminal-green bg-black p-0" 
        align="center"
      >
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <LessonScreen 
            lesson={lesson} 
            onComplete={handleComplete}
            isModal={true}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LessonModal;
