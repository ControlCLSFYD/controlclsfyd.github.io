
import React, { useState, useEffect } from 'react';
import GameContainer from "../components/GameContainer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Type for storing answers
interface SavedAnswers {
  [key: string]: string; // key format: "levelId-questionId"
}

const Index = () => {
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswers>({});
  const [introCompleted, setIntroCompleted] = useState(false);
  const isMobile = useIsMobile();

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

  // Handle video completion or skip
  const handleIntroComplete = () => {
    setIntroCompleted(true);
    sessionStorage.setItem('clsfyd-intro-watched', 'true');
  };

  console.log("Intro completed:", introCompleted);

  return (
    <div className="terminal">
      {!introCompleted ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
          <div className={`relative ${isMobile ? 'w-full' : 'max-w-[80%]'}`}>
            <video 
              src="/clsfyd intro.mp4"
              className="w-full h-auto rounded"
              autoPlay
              onEnded={handleIntroComplete}
              controls={false}
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <Button 
              variant="outline" 
              onClick={handleIntroComplete}
              className="absolute top-4 right-4 bg-terminal-black border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-black"
            >
              Skip
            </Button>
          </div>
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
