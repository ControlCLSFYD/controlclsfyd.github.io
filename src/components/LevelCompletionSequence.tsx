import React, { useState } from 'react';
import InvestisCompletionScreen from './InvestisCompletionScreen';
import DariosCompletionScreen from './DariosCompletionScreen';

interface LevelCompletionSequenceProps {
  level: number;
  onComplete: () => void;
}

const LevelCompletionSequence: React.FC<LevelCompletionSequenceProps> = ({ level, onComplete }) => {
  const [showDariosScreen, setShowDariosScreen] = useState(false);

  const handleInvestisContinue = () => {
    setShowDariosScreen(true);
  };

  if (showDariosScreen) {
    return <DariosCompletionScreen level={level} onContinue={onComplete} />;
  }

  return <InvestisCompletionScreen level={level} onContinue={handleInvestisContinue} />;
};

export default LevelCompletionSequence; 