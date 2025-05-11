
import { useState } from 'react';

export const useGameDifficulty = () => {
  const [noughtsAndCrossesDifficulty, setNoughtsAndCrossesDifficulty] = useState(1);
  const [courtDifficulty, setCourtDifficulty] = useState(1);
  const [duckHuntDifficulty, setDuckHuntDifficulty] = useState(1);
  const [spacewarDifficulty, setSpacewarDifficulty] = useState(1);
  const [uatDifficulty, setUatDifficulty] = useState(1);
  const [snekDifficulty, setSnekDifficulty] = useState(1);
  const [morseCodeDifficulty, setMorseCodeDifficulty] = useState(1);
  
  const increaseNoughtsAndCrossesDifficulty = () => {
    setNoughtsAndCrossesDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  const increaseCourtDifficulty = () => {
    setCourtDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  const increaseDuckHuntDifficulty = () => {
    setDuckHuntDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  const increaseSpacewarDifficulty = () => {
    setSpacewarDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  const increaseUatDifficulty = () => {
    setUatDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  const increaseSnekDifficulty = () => {
    setSnekDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  const increaseMorseCodeDifficulty = () => {
    setMorseCodeDifficulty(prev => Math.min(prev + 1, 3));
  };
  
  return {
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    duckHuntDifficulty,
    spacewarDifficulty,
    uatDifficulty,
    snekDifficulty,
    morseCodeDifficulty,
    increaseNoughtsAndCrossesDifficulty,
    increaseCourtDifficulty,
    increaseDuckHuntDifficulty,
    increaseSpacewarDifficulty,
    increaseUatDifficulty,
    increaseSnekDifficulty,
    increaseMorseCodeDifficulty
  };
};
