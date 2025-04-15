
import React, { useState } from 'react';
import TypewriterText from './TypewriterText';
import PyramidStamp from './PyramidStamp';
import { getRandomPsalm } from '../utils/psalms';

interface GameCompletionScreenProps {
  onComplete: () => void;
}

const GameCompletionScreen: React.FC<GameCompletionScreenProps> = ({ onComplete }) => {
  const [showPsalm, setShowPsalm] = useState(false);
  const randomPsalm = getRandomPsalm();

  const handleTypewriterComplete = () => {
    setShowPsalm(true);
    onComplete();
  };

  return (
    <div className="p-4 relative min-h-[80vh] flex flex-col justify-center items-center">
      <div className="max-w-2xl text-center">
        <TypewriterText
          text="Congratulations! That wasn't easy. You should email control@classifiedaccessories.com a hello message with your CV and the code: 112233YD. To buy Protection from the Game, and access Level 2, please purchase a CLSFYD Product."
          className="text-xl"
          onComplete={handleTypewriterComplete}
        />
      </div>

      {/* Psalm appears after the main message */}
      {showPsalm && (
        <div className="mt-12 text-terminal-green opacity-70 max-w-lg text-center">
          "{randomPsalm}"
        </div>
      )}

      {/* Pyramid Stamp at the bottom */}
      <PyramidStamp centered={false} />
    </div>
  );
};

export default GameCompletionScreen;

