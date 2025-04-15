
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GameInfoProps {
  showInstructions: boolean;
  winningScore: number;
  userScore: number;
  computerScore: number;
  difficulty?: number;
  cpuWins?: number;
  playerMovesFirst?: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ 
  showInstructions, 
  winningScore, 
  userScore, 
  computerScore,
  difficulty = 1,
  cpuWins = 0,
  playerMovesFirst = false
}) => {
  return (
    <>
      <h2 className="text-xl mb-4">SPACE PEACE CHALLENGE</h2>
      
      <div className="h-[60px] mb-2">
        {showInstructions ? (
          <div className="flex items-center p-2 border border-terminal-green">
            <span>Use</span>
            <ArrowLeft className="mx-1" size={20} />
            <ArrowRight className="mx-1" size={20} />
            <span>keys to move. Auto-firing enabled!</span>
          </div>
        ) : (
          <>
            <p className="mb-2">First to score {winningScore} points wins!</p>
            {difficulty > 1 && (
              <p className="mb-2 text-yellow-400">CPU Difficulty Level: {difficulty}</p>
            )}
            {cpuWins > 0 && (
              <p className="mb-2 text-orange-400">CPU Wins: {cpuWins}</p>
            )}
            {playerMovesFirst && (
              <p className="mb-2 text-green-400">You move first!</p>
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
