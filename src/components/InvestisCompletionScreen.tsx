import React from 'react';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

interface InvestisCompletionScreenProps {
  level: number;
  onContinue: () => void;
}

const levelMessages: Record<number, string> = {
  1: "Congratulations! \n You've unlocked a checkpoint: access code 223. \n This secures your current progress..",
  2: "Well done!\n This one wasn't easy. \n If you've made it this far, it means you have both the talent and interest required to become an agent. \n Push on! ",
  3: "Not bad! \n Remember, CLSFYD's game is just the first step. \n The real CLSFYD Challenge takes place in real life \n But other games will be developed to harness and locate those with alternative talents. \n Follow the team on instagram (@clsfyd) to stay updated.",
  4: "Amazing!! \n  If I were you, I'd go outside and take a breather. The next one will be the hardest level yet.",
  5: "Astounding job. \n The world needs you to follow our instructions. \n Because together, we will make a difference.",
};

const InvestisCompletionScreen: React.FC<InvestisCompletionScreenProps> = ({ level, onContinue }) => {
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
            text={levelMessages[level] || `Congratulations! You passed Level ${level}!`}
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

export default InvestisCompletionScreen;
