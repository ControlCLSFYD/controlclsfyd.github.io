
import React from 'react';
import CourtGame from '../CourtGame';
import NoughtsAndCrossesGame from '../NoughtsAndCrossesGame';
import SpaceWarGame from '../SpaceWarGame';
import SnekGame from '../SnekGame';
import UATGame from '../UATGame';

interface GameHandlerProps {
  showNoughtsAndCrossesGame: boolean;
  showCourtGame: boolean;
  showSpacePeaceGame: boolean;
  showUATGame: boolean;
  showSnekGame: boolean;
  handleNoughtsAndCrossesComplete: () => void;
  handleNoughtsAndCrossesPlayAgain: () => void;
  handleCourtComplete: () => void;
  handleCourtPlayAgain: (playerWon: boolean) => void;
  handleSpacePeaceComplete: () => void;
  handleSpacePeacePlayAgain: () => void;
  handleUATComplete: () => void;
  handleUATPlayAgain: () => void;
  handleSnekComplete: () => void;
  handleSnekPlayAgain: () => void;
  noughtsAndCrossesDifficulty: number;
  courtDifficulty: number;
  spacePeaceDifficulty: number;
  uatDifficulty: number;
  snekDifficulty: number;
}

const GameHandler: React.FC<GameHandlerProps> = ({
  showNoughtsAndCrossesGame,
  showCourtGame,
  showSpacePeaceGame,
  showUATGame, 
  showSnekGame,
  handleNoughtsAndCrossesComplete,
  handleNoughtsAndCrossesPlayAgain,
  handleCourtComplete,
  handleCourtPlayAgain,
  handleSpacePeaceComplete,
  handleSpacePeacePlayAgain,
  handleUATComplete,
  handleUATPlayAgain,
  handleSnekComplete,
  handleSnekPlayAgain,
  noughtsAndCrossesDifficulty,
  courtDifficulty,
  spacePeaceDifficulty,
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
  
  if (showSpacePeaceGame) {
    return (
      <SpaceWarGame 
        onGameComplete={handleSpacePeaceComplete} 
        onPlayAgain={handleSpacePeacePlayAgain}
        difficulty={spacePeaceDifficulty}
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
