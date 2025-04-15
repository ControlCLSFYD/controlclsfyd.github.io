
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from './ui/button';
import { HelpCircle, Image, RefreshCw } from 'lucide-react';
import InvestiGator from './InvestiGator';
import { LessonContent } from './LessonScreen';

interface LessonModalProps {
  lesson: LessonContent;
  onClose?: () => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black mb-2"
        >
          <HelpCircle size={16} />
          Investi Gator Help
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[800px] bg-black text-terminal-green border border-terminal-green">
        <InvestiGator lesson={lesson} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
