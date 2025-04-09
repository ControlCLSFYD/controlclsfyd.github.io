
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

  return (
    <div className="terminal">
      <GameContainer 
        savedAnswers={savedAnswers}
        onAnswerUpdate={handleAnswerUpdate}
      />
    </div>
  );
};

export default Index;
