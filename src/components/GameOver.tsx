
import React from 'react';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface GameOverProps {
  reason: 'timeout' | 'other';
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ reason, onRestart }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[80vh]">
      <div className="bg-black border border-terminal-green p-6 rounded-lg text-center max-w-lg">
        <h2 className="text-2xl text-terminal-green mb-6">GAME OVER</h2>
        
        <div className="mb-8">
          {reason === 'timeout' ? (
            <TypewriterText 
              text="Your time ran out. Please try again."
              className="text-lg text-terminal-green block"
              speed={15}
            />
          ) : (
            <TypewriterText 
              text="Game session ended. Please try again."
              className="text-lg text-terminal-green block"
              speed={15}
            />
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onRestart}
            className="border border-terminal-green text-terminal-green px-6 py-2 bg-black hover:bg-terminal-green hover:text-black"
          >
            RESTART GAME
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="border border-terminal-green text-terminal-green px-6 py-2 bg-black hover:bg-terminal-green hover:text-black"
          >
            RETURN TO HOME
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
