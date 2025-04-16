
import React from 'react';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h2 className="text-terminal-green text-3xl mb-4">GAME OVER</h2>
        <TypewriterText
          text="Your time ran out. Please try again."
          speed={15}
          className="text-xl text-terminal-green"
        />
      </div>
      
      <Button 
        onClick={onRestart}
        className="border border-terminal-green text-terminal-green px-6 py-3 bg-black hover:bg-terminal-green hover:text-black mt-6"
      >
        Try Again
      </Button>
    </div>
  );
};

export default GameOverScreen;
