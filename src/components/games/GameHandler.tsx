
import React from 'react';
import CourtGame from '../CourtGame';
import NoughtsAndCrossesGame from '../NoughtsAndCrossesGame';
import UATGame from '../UATGame';
import SnekGame from '../SnekGame';

interface GameHandlerProps {
  showNoughtsAndCrossesGame: boolean;
  showCourtGame: boolean;
  showDuckHuntGame: boolean;
  showSpacewarGame: boolean;
  showUATGame: boolean;
  showSnekGame: boolean;
  handleNoughtsAndCrossesComplete: () => void;
  handleNoughtsAndCrossesPlayAgain: () => void;
  handleCourtComplete: () => void;
  handleCourtPlayAgain: (playerWon: boolean) => void;
  handleDuckHuntComplete: () => void;
  handleDuckHuntPlayAgain: () => void;
  handleSpacewarComplete: () => void;
  handleSpacewarPlayAgain: (playerWon: boolean) => void;
  handleUATComplete: () => void;
  handleUATPlayAgain: () => void;
  handleSnekComplete: () => void;
  handleSnekPlayAgain: () => void;
  noughtsAndCrossesDifficulty: number;
  courtDifficulty: number;
  duckHuntDifficulty: number;
  spacewarDifficulty: number;
  uatDifficulty: number;
  snekDifficulty: number;
}

const GameHandler: React.FC<GameHandlerProps> = ({
  showNoughtsAndCrossesGame,
  showCourtGame,
  showUATGame, 
  showSnekGame,
  handleNoughtsAndCrossesComplete,
  handleNoughtsAndCrossesPlayAgain,
  handleCourtComplete,
  handleCourtPlayAgain,
  handleUATComplete,
  handleUATPlayAgain,
  handleSnekComplete,
  handleSnekPlayAgain,
  noughtsAndCrossesDifficulty,
  courtDifficulty,
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
