
import React, { useState, useEffect } from 'react';
import GameContainer from "../components/GameContainer";

// Type for storing answers
interface SavedAnswers {
  [key: string]: string; // key format: "levelId-questionId"
}

const Index = () => {
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswers>({});
  const [introCompleted, setIntroCompleted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

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
    console.log("Video completed, moving to game");
  };

  // Handle video loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    console.log("Video loaded and ready to play");
  };

  // Handle skip intro
  const handleSkipIntro = () => {
    const video = document.getElementById('intro-video') as HTMLVideoElement;
    if (video) {
      video.pause();
    }
    handleIntroComplete();
  };

  return (
    <div className="terminal">
      {!introCompleted ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <video 
            id="intro-video"
            src="/clsfyd intro.mp4"
            className="max-w-full max-h-[80vh] z-10"
            autoPlay
            muted={false}
            playsInline
            onLoadedData={handleVideoLoaded}
            onEnded={handleIntroComplete}
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
          
          {videoLoaded && (
            <button
              onClick={handleSkipIntro}
              className="absolute bottom-10 right-10 bg-terminal-green bg-opacity-20 border border-terminal-green px-4 py-2 text-terminal-green hover:bg-opacity-40 transition-all z-20"
            >
              Skip Intro
            </button>
          )}
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
