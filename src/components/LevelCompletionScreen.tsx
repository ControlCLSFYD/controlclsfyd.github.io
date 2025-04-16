
import React from 'react';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';
import { INVESTI_LEVEL_CONGRATS } from '../utils/investigatorImages';

interface LevelCompletionScreenProps {
  level: number;
  onContinue: () => void;
}

const LevelCompletionScreen: React.FC<LevelCompletionScreenProps> = ({ 
  level, 
  onContinue 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[70vh]">
      <div className="flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto">
        <div className="w-full md:w-1/3 text-center">
          <img 
            src={INVESTI_LEVEL_CONGRATS}
            alt="Investi Gator celebrating" 
            className="w-40 h-auto mx-auto md:w-full max-w-[200px] object-contain bg-black"
          />
        </div>
        
        <div className="w-full md:w-2/3 bg-black border border-terminal-green p-4 rounded-lg relative">
          <div className="hidden md:block absolute w-4 h-4 bg-black border-l border-b border-terminal-green transform rotate-45 left-[-8px] top-12"></div>
          
          <TypewriterText 
            text={`Congratulations! You passed level ${level}!`}
            className="text-xl text-terminal-green mb-4 block"
            speed={15}
          />
          
          <div className="mt-6 text-center">
            <Button 
              onClick={onContinue}
              className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black"
            >
              CONTINUE TO NEXT LEVEL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCompletionScreen;
