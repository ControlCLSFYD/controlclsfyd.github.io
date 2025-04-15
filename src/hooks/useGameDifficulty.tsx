
import { useState } from 'react';

export const useGameDifficulty = () => {
  const [noughtsAndCrossesDifficulty, setNoughtsAndCrossesDifficulty] = useState(1);
  const [courtDifficulty, setCourtDifficulty] = useState(1);
  const [spacePeaceDifficulty, setSpacePeaceDifficulty] = useState(1);
  const [uatDifficulty, setUATDifficulty] = useState(1);
  const [snekDifficulty, setSnekDifficulty] = useState(1);
  
  const MAX_DIFFICULTY = 5;
  
  const increaseNoughtsAndCrossesDifficulty = () => {
    setNoughtsAndCrossesDifficulty(prev => Math.min(prev + 1, MAX_DIFFICULTY));
  };
  
  const increaseCourtDifficulty = () => {
    setCourtDifficulty(prev => Math.min(prev + 1, MAX_DIFFICULTY));
  };
  
  const increaseSpacePeaceDifficulty = () => {
    setSpacePeaceDifficulty(prev => Math.min(prev + 1, MAX_DIFFICULTY));
  };
  
  const increaseUATDifficulty = () => {
    setUATDifficulty(prev => Math.min(prev + 1, MAX_DIFFICULTY));
  };
  
  const increaseSnekDifficulty = () => {
    setSnekDifficulty(prev => Math.min(prev + 1, MAX_DIFFICULTY));
  };
  
  return {
    noughtsAndCrossesDifficulty,
    courtDifficulty,
    spacePeaceDifficulty,
    uatDifficulty,
    snekDifficulty,
    increaseNoughtsAndCrossesDifficulty,
    increaseCourtDifficulty,
    increaseSpacePeaceDifficulty,
    increaseUATDifficulty,
    increaseSnekDifficulty
  };
};
