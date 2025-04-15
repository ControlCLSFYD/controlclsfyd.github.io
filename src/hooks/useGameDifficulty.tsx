
import { useState } from 'react';

export const useGameDifficulty = () => {
  const [pongDifficulty, setPongDifficulty] = useState(1);
  const [oxoDifficulty, setOxoDifficulty] = useState(1);
  const [spacewarDifficulty, setSpacewarDifficulty] = useState(1);
  const [tetrisDifficulty, setTetrisDifficulty] = useState(1);
  const [snakeDifficulty, setSnakeDifficulty] = useState(1);
  
  const increasePongDifficulty = () => setPongDifficulty(prev => Math.min(prev + 1, 5));
  const increaseOxoDifficulty = () => setOxoDifficulty(prev => Math.min(prev + 1, 5));
  const increaseSpacewarDifficulty = () => setSpacewarDifficulty(prev => Math.min(prev + 1, 5));
  const increaseTetrisDifficulty = () => setTetrisDifficulty(prev => Math.min(prev + 1, 5));
  const increaseSnakeDifficulty = () => setSnakeDifficulty(prev => Math.min(prev + 1, 5));
  
  return {
    pongDifficulty, increasePongDifficulty,
    oxoDifficulty, increaseOxoDifficulty,
    spacewarDifficulty, increaseSpacewarDifficulty,
    tetrisDifficulty, increaseTetrisDifficulty,
    snakeDifficulty, increaseSnakeDifficulty
  };
};
