
import { useState } from 'react';

export const useGameDifficulty = () => {
  const [noughtsAndCrossesDifficulty, setNoughtsAndCrossesDifficulty] = useState(1);
  const [courtDifficulty, setCourtDifficulty] = useState(1);
  const [duckHuntDifficulty, setDuckHuntDifficulty] = useState(1);
  const [spacewarDifficulty, setSpacewarDifficulty] = useState(1);
  const [uatDifficulty, setUatDifficulty] = useState(1);
  const [snekDifficulty, setSnekDifficulty] = useState(1);
  
  const increaseNoughtsAndCrossesDifficulty = () => {
    setNoughtsAndCrossesDifficulty(prev => Math.min(prev + 1, 5));
  };
  
  const increaseCourtDifficulty = () => {
    setCourtDifficulty(prev => Math.min(prev + 1, 5));
  };
  
  const increaseDuckHuntDifficulty = () => {
    setDuckHuntDifficulty(prev => Math.min(prev + 1, 5));
  };
  
  const increaseSpacewarDifficulty = () => {
    setSpacewarDifficulty(prev => Math.min(prev + 1, 5));
  };
  
  const increaseUatDifficulty = () => {
    setUatDifficulty(prev => Math.min(prev + 1, 5));
  };
  
  const increaseSnekDifficulty = () => {
    setSnekDifficulty(prev => Math.min(prev + 1, 5));
  };
  
  return {
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    duckHuntDifficulty,
    spacewarDifficulty,
    uatDifficulty,
    snekDifficulty,
    increaseNoughtsAndCrossesDifficulty,
    increaseCourtDifficulty,
    increaseDuckHuntDifficulty,
    increaseSpacewarDifficulty,
    increaseUatDifficulty,
    increaseSnekDifficulty
  };
};
