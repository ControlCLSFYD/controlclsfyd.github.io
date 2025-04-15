
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from './ui/button';
import { Image } from 'lucide-react';
import InvestiGator from './InvestiGator';
import { LessonContent } from './LessonScreen';

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
          <img 
            src="/lovable-uploads/b721b90f-fd57-4feb-aecd-e7a1f7f2ab94.png" 
            alt="Investi Gator" 
            className="w-6 h-6 object-contain bg-black"
          />
          Investi Gator's Help
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[800px] h-auto max-h-[90vh] overflow-y-auto bg-black text-terminal-green border border-terminal-green p-2 md:p-4">
        <InvestiGator lesson={lesson} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
