
import React, { useState } from 'react';
import TypewriterText from './TypewriterText';

interface GameCompletionScreenProps {
  onComplete: () => void;
}

const GameCompletionScreen: React.FC<GameCompletionScreenProps> = ({ onComplete }) => {
  return (
    <div className="p-4">
      <TypewriterText
        text="Congratulations! That wasn't easy. You should email control@classifiedaccessories.com a hello message with your CV and the code: 112233YD. To buy Protection from the Game, and access Level 2, please purchase a CLSFYD Product."
        className="text-xl"
        onComplete={onComplete}
      />
    </div>
  );
};

export default GameCompletionScreen;
