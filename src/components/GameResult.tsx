import React from 'react';
import { Button } from './ui/button';
import { GameResultProps } from '../interfaces/GameInterfaces';

// Update the interface to include gameDrawn prop
interface ExtendedGameResultProps extends Omit<GameResultProps, 'onPlayAgain'> {
  gameDrawn?: boolean;
  onPlayAgain?: () => void;
}

const GameResult: React.FC<ExtendedGameResultProps> = ({ 
  gameWon, 
  gameDrawn, 
  onContinue, 
  onPlayAgain, 
  alwaysShowContinue = false 
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
      <div className="text-terminal-green text-2xl mb-6 font-mono">
        {gameWon ? 'MISSION COMPLETE' : (gameDrawn ? 'DRAW!' : 'GAME OVER')}
      </div>
      
      <div className="flex gap-6 mt-4">
        {(gameWon || alwaysShowContinue) && (
          <Button 
            variant="outline" 
            onClick={onContinue}
            className="px-8 py-6 border-2 border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black uppercase font-mono tracking-wider"
          >
            Continue
          </Button>
        )}
        {onPlayAgain && (
          <Button 
            variant="outline" 
            onClick={onPlayAgain}
            className="px-8 py-6 border-2 border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black uppercase font-mono tracking-wider"
          >
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameResult;
