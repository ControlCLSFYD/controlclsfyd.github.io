
import React from 'react';
import CourtGame from '../CourtGame';
import NoughtsAndCrossesGame from '../NoughtsAndCrossesGame';
import DuckHunt from '../DuckHunt';
import SnekGame from '../SnekGame';
import UATGame from '../UATGame';

interface GameHandlerProps {
  showNoughtsAndCrossesGame: boolean;
  showCourtGame: boolean;
  showDuckHuntGame: boolean;
  showUATGame: boolean;
  showSnekGame: boolean;
  handleNoughtsAndCrossesComplete: () => void;
  handleNoughtsAndCrossesPlayAgain: () => void;
  handleCourtComplete: () => void;
  handleCourtPlayAgain: (playerWon: boolean) => void;
  handleDuckHuntComplete: () => void;
  handleDuckHuntPlayAgain: () => void;
  handleUATComplete: () => void;
  handleUATPlayAgain: () => void;
  handleSnekComplete: () => void;
  handleSnekPlayAgain: () => void;
  noughtsAndCrossesDifficulty: number;
  courtDifficulty: number;
  duckHuntDifficulty: number;
  uatDifficulty: number;
  snekDifficulty: number;
}

const GameHandler: React.FC<GameHandlerProps> = ({
  showNoughtsAndCrossesGame,
  showCourtGame,
  showDuckHuntGame,
  showUATGame, 
  showSnekGame,
  handleNoughtsAndCrossesComplete,
  handleNoughtsAndCrossesPlayAgain,
  handleCourtComplete,
  handleCourtPlayAgain,
  handleDuckHuntComplete,
  handleDuckHuntPlayAgain,
  handleUATComplete,
  handleUATPlayAgain,
  handleSnekComplete,
  handleSnekPlayAgain,
  noughtsAndCrossesDifficulty,
  courtDifficulty,
  duckHuntDifficulty,
  uatDifficulty,
  snekDifficulty
}) => {
  if (showNoughtsAndCrossesGame) {
    return (
      <NoughtsAndCrossesGame 
        onGameComplete={handleNoughtsAndCrossesComplete} 
        onPlayAgain={handleNoughtsAndCrossesPlayAgain} 
        difficulty={noughtsAndCrossesDifficulty}
      />
    );
  }
  
  if (showCourtGame) {
    return (
      <CourtGame 
        onGameComplete={handleCourtComplete} 
        onPlayAgain={handleCourtPlayAgain}
        difficulty={courtDifficulty}
      />
    );
  }
  
  if (showDuckHuntGame) {
    return (
      <DuckHunt 
        onGameComplete={handleDuckHuntComplete} 
        onPlayAgain={handleDuckHuntPlayAgain}
        difficulty={duckHuntDifficulty}
      />
    );
  }
  
  if (showUATGame) {
    return (
      <UATGame 
        onGameComplete={handleUATComplete} 
        onPlayAgain={handleUATPlayAgain}
        difficulty={uatDifficulty}
      />
    );
  }
  
  if (showSnekGame) {
    return (
      <SnekGame 
        onGameComplete={handleSnekComplete} 
        onPlayAgain={handleSnekPlayAgain}
        difficulty={snekDifficulty}
      />
    );
  }
  
  return null;
};

export default GameHandler;
