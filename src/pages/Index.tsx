
import React, { useState, useEffect } from 'react';
import GameContainer from "../components/GameContainer";

// Type for storing answers
interface SavedAnswers {
  [key: string]: string; // key format: "levelId-questionId"
}

const Index = () => {
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswers>({});

  // Load saved answers from localStorage on initial load
  useEffect(() => {
    const storedAnswers = localStorage.getItem('clsfyd-game-answers');
    if (storedAnswers) {
      setSavedAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  // Save answers to localStorage
  const handleAnswerUpdate = (levelId: number, questionId: string, answer: string) => {
    const answerKey = `${levelId}-${questionId}`;
    const updatedAnswers = { ...savedAnswers, [answerKey]: answer };
    
    setSavedAnswers(updatedAnswers);
    localStorage.setItem('clsfyd-game-answers', JSON.stringify(updatedAnswers));
  };

  // Reset all game answers
  const handleResetGame = () => {
    setSavedAnswers({});
    localStorage.removeItem('clsfyd-game-answers');
  };

  return (
    <div className="terminal">
      <GameContainer 
        savedAnswers={savedAnswers}
        onAnswerUpdate={handleAnswerUpdate}
        onResetGame={handleResetGame}
      />
    </div>
  );
};

export default Index;
