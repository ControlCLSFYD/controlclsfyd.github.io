
import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface GameInfoProps {
  showInstructions: boolean;
  winningScore: number;
  userScore: number;
  computerScore: number;
  difficulty?: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ 
  showInstructions, 
  winningScore, 
  userScore, 
  computerScore,
  difficulty = 1
}) => {
  return (
    <>
      <h2 className="text-xl mb-4">SPACEWAR!</h2>
      
      <div className="h-[40px] mb-2">
        {showInstructions ? (
          <div className="flex flex-col items-center p-2 border border-terminal-green">
            <div className="text-xs mt-1 text-yellow-400">
              First to reach {winningScore} points wins!
            </div>
          </div>
        ) : (
          <>
            <p className="mb-2">First to score {winningScore} points wins!</p>
            {difficulty > 1 && (
              <p className="mb-2 text-yellow-400">CPU Difficulty Level: {difficulty}</p>
            )}
          </>
        )}
      </div>
      
      <div className="mb-4 flex justify-between w-full max-w-[600px] px-4">
        <span>Player: {userScore}</span>
        <span>CPU: {computerScore}</span>
      </div>
    </>
  );
};

export default GameInfo;
