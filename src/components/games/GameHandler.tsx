
import React from 'react';
import CourtGame from '../CourtGame';
import NoughtsAndCrossesGame from '../NoughtsAndCrossesGame';
import UATGame from '../UATGame';
import SnekGame from '../SnekGame';
import MorseCodeGame from '../MorseCodeGame';

interface GameHandlerProps {
  showNoughtsAndCrossesGame: boolean;
  showCourtGame: boolean;
  showDuckHuntGame: boolean;
  showSpacewarGame: boolean;
  showUATGame: boolean;
  showSnekGame: boolean;
  showMorseCodeGame: boolean;
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
  handleMorseCodeComplete: () => void;
  handleMorseCodePlayAgain: () => void;
  noughtsAndCrossesDifficulty: number;
  courtDifficulty: number;
  duckHuntDifficulty: number;
  spacewarDifficulty: number;
  uatDifficulty: number;
  snekDifficulty: number;
  morseCodeDifficulty: number;
}

const GameHandler: React.FC<GameHandlerProps> = ({
  showNoughtsAndCrossesGame,
  showCourtGame,
  showUATGame, 
  showSnekGame,
  showMorseCodeGame,
  handleNoughtsAndCrossesComplete,
  handleNoughtsAndCrossesPlayAgain,
  handleCourtComplete,
  handleCourtPlayAgain,
  handleUATComplete,
  handleUATPlayAgain,
  handleSnekComplete,
  handleSnekPlayAgain,
  handleMorseCodeComplete,
  handleMorseCodePlayAgain,
  noughtsAndCrossesDifficulty,
  courtDifficulty,
  uatDifficulty,
  snekDifficulty,
  morseCodeDifficulty
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

  if (showMorseCodeGame) {
    return (
      <MorseCodeGame
        onGameComplete={handleMorseCodeComplete}
        onPlayAgain={handleMorseCodePlayAgain}
        difficulty={morseCodeDifficulty}
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
