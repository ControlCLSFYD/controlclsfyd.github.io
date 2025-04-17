
import React from 'react';

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
      <div className="h-[20px] mb-2">
        {showInstructions && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-yellow-400">
              First to reach {winningScore} points wins!
            </div>
          </div>
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
