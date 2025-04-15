import React from 'react';
import PongGame from '../PongGame';
import OxoGame from '../OxoGame';
import SpacewarGame from '../SpacewarGame';
import SnakeGame from '../SnakeGame';
import TetrisGame from '../TetrisGame';

interface GameHandlerProps {
  showOxoGame: boolean;
  showPongGame: boolean;
  showSpacewarGame: boolean;
  showTetrisGame: boolean;
  showSnakeGame: boolean;
  handleOxoComplete: () => void;
  handleOxoPlayAgain: () => void;
  handlePongComplete: () => void;
  handlePongPlayAgain: (playerWon: boolean) => void;
  handleSpacewarComplete: () => void;
  handleSpacewarPlayAgain: () => void;
  handleTetrisComplete: () => void;
  handleTetrisPlayAgain: () => void;
  handleSnakeComplete: () => void;
  handleSnakePlayAgain: () => void;
  oxoDifficulty: number;
  pongDifficulty: number;
  spacewarDifficulty: number;
  tetrisDifficulty: number;
  snakeDifficulty: number;
}

const GameHandler: React.FC<GameHandlerProps> = ({
  showOxoGame,
  showPongGame,
  showSpacewarGame,
  showTetrisGame, 
  showSnakeGame,
  handleOxoComplete,
  handleOxoPlayAgain,
  handlePongComplete,
  handlePongPlayAgain,
  handleSpacewarComplete,
  handleSpacewarPlayAgain,
  handleTetrisComplete,
  handleTetrisPlayAgain,
  handleSnakeComplete,
  handleSnakePlayAgain,
  oxoDifficulty,
  pongDifficulty,
  spacewarDifficulty,
  tetrisDifficulty,
  snakeDifficulty
}) => {
  if (showOxoGame) {
    return (
      <OxoGame 
        onGameComplete={handleOxoComplete} 
        onPlayAgain={handleOxoPlayAgain} 
        difficulty={oxoDifficulty}
      />
    );
  }
  
  if (showPongGame) {
    return (
      <PongGame 
        onGameComplete={handlePongComplete} 
        onPlayAgain={handlePongPlayAgain}
        difficulty={pongDifficulty}
      />
    );
  }
  
  if (showSpacewarGame) {
    return (
      <SpacewarGame 
        onGameComplete={handleSpacewarComplete} 
        onPlayAgain={handleSpacewarPlayAgain}
        difficulty={spacewarDifficulty}
      />
    );
  }
  
  if (showTetrisGame) {
    return (
      <TetrisGame 
        onGameComplete={handleTetrisComplete} 
        onPlayAgain={handleTetrisPlayAgain}
        difficulty={tetrisDifficulty}
      />
    );
  }
  
  if (showSnakeGame) {
    return (
      <SnakeGame 
        onGameComplete={handleSnakeComplete} 
        onPlayAgain={handleSnakePlayAgain}
        difficulty={snakeDifficulty}
      />
    );
  }
  
  return null;
};

export default GameHandler;
