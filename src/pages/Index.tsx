
import React, { useState, useEffect } from 'react';
import GameContainer from "../components/GameContainer";

// Type for storing answers
interface SavedAnswers {
  [key: string]: string; // key format: "levelId-questionId"
}

const Index = () => {
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswers>({});
  const [introCompleted, setIntroCompleted] = useState(false);

  // Load saved answers from localStorage on initial load
  useEffect(() => {
    const storedAnswers = localStorage.getItem('clsfyd-game-answers');
    if (storedAnswers) {
      setSavedAnswers(JSON.parse(storedAnswers));
    }

    // Check if intro has been watched in this session
    const introWatched = sessionStorage.getItem('clsfyd-intro-watched');
    if (introWatched) {
      setIntroCompleted(true);
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

  // Handle video completion
  const handleIntroComplete = () => {
    setIntroCompleted(true);
    sessionStorage.setItem('clsfyd-intro-watched', 'true');
  };

  return (
    <div className="terminal">
      {!introCompleted ? (
        <div className="w-full h-full flex items-center justify-center">
          <video 
            src="/clsfyd intro.mp4"
            className="max-w-full max-h-[80vh]"
            autoPlay
            onEnded={handleIntroComplete}
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <GameContainer 
          savedAnswers={savedAnswers}
          onAnswerUpdate={handleAnswerUpdate}
          onResetGame={handleResetGame}
        />
      )}
    </div>
  );
};

export default Index;
