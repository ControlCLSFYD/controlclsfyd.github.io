
import React from 'react';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

interface LevelCompletionScreenProps {
  level: number;
  onContinue: () => void;
}

const LevelCompletionScreen: React.FC<LevelCompletionScreenProps> = ({ level, onContinue }) => {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-full md:w-1/3 text-center">
          <img 
            src="/lovable-uploads/f0f71fc9-9526-4667-b6d8-43949457e3d7.png" 
            alt="Investi Gator celebrates" 
            className="w-32 h-auto mx-auto md:w-full max-w-[200px] object-contain bg-black"
          />
        </div>
        
        <div className="w-full md:w-2/3 bg-black border border-terminal-green p-4 rounded-lg">
          <TypewriterText
            text={`Congratulations! You passed Level ${level}!`}
            speed={15}
            className="text-xl text-terminal-green mb-4"
          />
        </div>
      </div>
      
      <Button 
        onClick={onContinue}
        className="border border-terminal-green text-terminal-green px-6 py-3 bg-black hover:bg-terminal-green hover:text-black"
      >
        Continue to Next Level
      </Button>
    </div>
  );
};

export default LevelCompletionScreen;
