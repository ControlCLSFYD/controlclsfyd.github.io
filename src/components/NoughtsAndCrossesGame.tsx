
import React from 'react';
import { useTicTacToeGame } from '../hooks/useTicTacToeGame';
import TicTacToeBoard from './TicTacToeBoard';
import GameResult from './GameResult';

interface NoughtsAndCrossesGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
}

const NoughtsAndCrossesGame: React.FC<NoughtsAndCrossesGameProps> = ({ 
  onGameComplete, 
  onPlayAgain, 
  difficulty = 1 
}) => {
  const {
    board,
    isPlayerTurn,
    gameStatus,
    showInstructions,
    cpuWins,
    playerFirstMove,
    gameObjective,
    handleCellClick,
    handleContinue,
    handlePlayAgain
  } = useTicTacToeGame(onGameComplete, onPlayAgain, difficulty);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full p-4">
      <h2 className="text-xl mb-4">NOUGHTS AND CROSSES CHALLENGE</h2>
      
      <div className="h-20 flex items-center justify-center mb-4">
        {showInstructions ? (
          <div className="flex items-center p-2 border border-terminal-green">
            <span>You play as O. {gameObjective}</span>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-2">Win the game to continue</p>
            {cpuWins > 0 && (
              <p className="mb-2 text-yellow-400">CPU Wins: {cpuWins}</p>
            )}
            {difficulty > 1 && (
              <p className="mb-2 text-yellow-400">CPU Difficulty Level: Maximum</p>
            )}
          </div>
        )}
      </div>
      
      <TicTacToeBoard
        board={board}
        isPlayerTurn={isPlayerTurn}
        gameStatus={gameStatus}
        onCellClick={handleCellClick}
      />
      
      {gameStatus !== 'playing' && (
        <GameResult
          gameWon={gameStatus === 'won'}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={false}
        />
      )}
    </div>
  );
};

export default NoughtsAndCrossesGame;
