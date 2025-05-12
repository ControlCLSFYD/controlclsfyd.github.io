
import { useState } from 'react';

export const useGameDifficulty = () => {
  const [courtDifficulty, setCourtDifficulty] = useState(1);
  const [noughtsAndCrossesDifficulty, setNoughtsAndCrossesDifficulty] = useState(1);
  const [duckHuntDifficulty, setDuckHuntDifficulty] = useState(1);
  const [spacewarDifficulty, setSpacewarDifficulty] = useState(1);
  const [uatDifficulty, setUatDifficulty] = useState(1);
  const [snekDifficulty, setSnekDifficulty] = useState(1);
  const [morseCodeDifficulty, setMorseCodeDifficulty] = useState(1);
  const [morseCodeAudioDifficulty, setMorseCodeAudioDifficulty] = useState(1);
  
  const increaseCourtDifficulty = () => setCourtDifficulty(prev => Math.min(prev + 1, 5));
  const increaseNoughtsAndCrossesDifficulty = () => setNoughtsAndCrossesDifficulty(prev => Math.min(prev + 1, 5));
  const increaseDuckHuntDifficulty = () => setDuckHuntDifficulty(prev => Math.min(prev + 1, 5));
  const increaseSpacewarDifficulty = () => setSpacewarDifficulty(prev => Math.min(prev + 1, 5));
  const increaseUatDifficulty = () => setUatDifficulty(prev => Math.min(prev + 1, 5));
  const increaseSnekDifficulty = () => setSnekDifficulty(prev => Math.min(prev + 1, 5));
  const increaseMorseCodeDifficulty = () => setMorseCodeDifficulty(prev => Math.min(prev + 1, 5));
  const increaseMorseCodeAudioDifficulty = () => setMorseCodeAudioDifficulty(prev => Math.min(prev + 1, 5));
  
  return {
    courtDifficulty, increaseCourtDifficulty,
    noughtsAndCrossesDifficulty, increaseNoughtsAndCrossesDifficulty,
    duckHuntDifficulty, increaseDuckHuntDifficulty,
    spacewarDifficulty, increaseSpacewarDifficulty,
    uatDifficulty, increaseUatDifficulty,
    snekDifficulty, increaseSnekDifficulty,
    morseCodeDifficulty, increaseMorseCodeDifficulty,
    morseCodeAudioDifficulty, increaseMorseCodeAudioDifficulty
  };
};
