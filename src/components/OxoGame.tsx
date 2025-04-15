
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import GameResult from './GameResult';
import TicTacToeBoard from './TicTacToeBoard';
import { useTicTacToeGame } from '../hooks/useTicTacToeGame';

interface OxoGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
}

const OxoGame: React.FC<OxoGameProps> = ({ 
  onGameComplete, 
  onPlayAgain,
  difficulty = 5 // Set default difficulty to maximum
}) => {
  const [drawCount, setDrawCount] = useState<number>(0);
  const [roundCount, setRoundCount] = useState<number>(1);
  const [cpuFirst, setCpuFirst] = useState<boolean>(true);
  
  const {
    board,
    gameStatus,
    showInstructions,
    handleCellClick,
    resetGame
  } = useTicTacToeGame({
    difficulty,
    cpuMovesFirst: cpuFirst
  });
  
  useEffect(() => {
    // Reset game when round changes
    resetGame();
  }, [roundCount, resetGame]);

  useEffect(() => {
    // Update draw count when game ends in draw
    if (gameStatus === 'draw') {
      setDrawCount(prev => prev + 1);
    }
  }, [gameStatus]);
  
  const handleContinue = () => {
    if (drawCount >= 2) {
      // Player has drawn twice, complete the game
      onGameComplete();
    } else {
      // Start next round with alternating first player
      setRoundCount(prev => prev + 1);
      setCpuFirst(prev => !prev);
    }
  };
  
  const handlePlayAgain = () => {
    // Reset the current round without changing who goes first
    resetGame();
    // If player won or lost, don't change the round count
    onPlayAgain();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full p-4">
      <h2 className="text-xl mb-4">OXO CHALLENGE</h2>
      
      <div className="h-20 flex items-center justify-center mb-4">
        {showInstructions ? (
          <div className="flex items-center p-2 border border-terminal-green">
            <span>You play as O. {cpuFirst ? 'CPU plays first. Try to force a draw!' : 'You play first. Try to force a draw!'}</span>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-2">Draw twice to continue</p>
            <p className="mb-2">Current draws: {drawCount}/2</p>
            <p className="mb-2">Round {roundCount}: {cpuFirst ? 'CPU plays first' : 'You play first'}</p>
            <p className="mb-2 text-yellow-400">CPU Difficulty Level: {difficulty}</p>
          </div>
        )}
      </div>
      
      <TicTacToeBoard 
        board={board} 
        onCellClick={handleCellClick}
      />
      
      {gameStatus !== 'playing' && (
        <GameResult
          gameWon={gameStatus === 'won'}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={gameStatus === 'draw'}
        />
      )}
    </div>
  );
};

export default OxoGame;
