
import React, { useState, useEffect } from 'react';
import GameLevel from './GameLevel';
import TypewriterText from './TypewriterText';
import { gameLevels } from '../data/gameData';

interface GameContainerProps {
  savedAnswers: Record<string, string>;
  onAnswerUpdate: (levelId: number, questionId: string, answer: string) => void;
  onResetGame: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ 
  savedAnswers, 
  onAnswerUpdate,
  onResetGame
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [loadingStep, setLoadingStep] = useState(1);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    // Sequential loading steps with typewriter effect
    const dotTimeout = setTimeout(() => {
      setLoadingStep(2); // Show loading dots
    }, 1000);

    const initTimeout = setTimeout(() => {
      setLoadingStep(3); // Show initializing text
    }, 2500);

    const codeTimeout = setTimeout(() => {
      setLoadingStep(4); // Show access code prompt
    }, 5000);

    return () => {
      clearTimeout(dotTimeout);
      clearTimeout(initTimeout);
      clearTimeout(codeTimeout);
    };
  }, []);

  // Check for already completed levels based on saved answers
  useEffect(() => {
    if (Object.keys(savedAnswers).length > 0) {
      const newCompletedLevels: number[] = [];
      
      gameLevels.forEach((level, index) => {
        const levelNum = index + 1;
        const allQuestionsAnswered = level.questions.every(question => {
          const answerKey = `${levelNum}-${question.id}`;
          const savedAnswer = savedAnswers[answerKey];
          return savedAnswer && savedAnswer.trim().toLowerCase() === question.answer.toLowerCase();
        });
        
        if (allQuestionsAnswered) {
          newCompletedLevels.push(levelNum);
        }
      });
      
      setCompletedLevels(newCompletedLevels);
    }
  }, [savedAnswers]);

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "111") {
      // Reset any existing answers when starting a new game
      onResetGame();
      setGameStarted(true);
      setCurrentLevel(1);
    }
  };

  const handleLevelComplete = () => {
    // Add the current level to completed levels if not already there
    if (!completedLevels.includes(currentLevel)) {
      setCompletedLevels(prev => [...prev, currentLevel]);
    }
    
    if (currentLevel < gameLevels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setGameCompleted(true);
    }
  };

  const navigateLevel = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentLevel < gameLevels.length) {
      // Only allow navigation to next level if current level is completed
      if (completedLevels.includes(currentLevel)) {
        setCurrentLevel(currentLevel + 1);
      }
    } else if (direction === 'prev' && currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  // Check if the next level is accessible
  const isNextLevelAccessible = completedLevels.includes(currentLevel);

  const renderLoadingScreen = () => {
    return (
      <div className="flex flex-col items-start">
        {loadingStep === 2 && (
          <div className="mb-8">
            <TypewriterText 
              text="..." 
              speed={200} 
              onComplete={() => setTimeout(() => setLoadingStep(3), 500)}
            />
          </div>
        )}

        {loadingStep === 3 && (
          <div className="mb-8">
            <TypewriterText 
              text="CLSFYD Challenge Initializing..." 
              onComplete={() => setTimeout(() => setLoadingStep(4), 1000)}
            />
          </div>
        )}

        {loadingStep === 4 && (
          <div>
            <TypewriterText text="Send your access code." className="mb-4 block" />
            <form onSubmit={handleAccessCodeSubmit} className="mt-4">
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-transparent border border-terminal-green text-terminal-green p-1 focus:outline-none"
                autoFocus
              />
              <button 
                type="submit" 
                className="border border-terminal-green text-terminal-green px-2 py-1 ml-2 focus:outline-none hover:bg-terminal-green hover:bg-opacity-20"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="terminal p-4">
      {!gameStarted ? (
        renderLoadingScreen()
      ) : (
        <div>
          {/* Navigation Buttons */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigateLevel('prev')}
              disabled={currentLevel <= 1}
              className={`border border-terminal-green px-2 py-1 mr-2 ${
                currentLevel <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-terminal-green hover:bg-opacity-20'
              }`}
            >
              &lt; Previous
            </button>
            <button
              onClick={() => navigateLevel('next')}
              disabled={currentLevel >= gameLevels.length || !isNextLevelAccessible}
              className={`border border-terminal-green px-2 py-1 ${
                currentLevel >= gameLevels.length || !isNextLevelAccessible 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-terminal-green hover:bg-opacity-20'
              }`}
            >
              Next &gt;
            </button>
          </div>

          {/* Game Content */}
          {gameCompleted ? (
            <div className="p-4">
              <TypewriterText
                text="Thank you for completing Level 1 of the CLSFYD Game (Pre-Alpha). Please purchase a CLSFYD Product to gain access to Level 2 of the Game."
                className="text-xl"
              />
            </div>
          ) : (
            currentLevel > 0 && currentLevel <= gameLevels.length && (
              <GameLevel
                key={currentLevel}
                level={currentLevel}
                questions={gameLevels[currentLevel - 1].questions}
                imageSrc={gameLevels[currentLevel - 1].imageSrc}
                isActive={true}
                onLevelComplete={handleLevelComplete}
                savedAnswers={savedAnswers}
                onAnswerUpdate={onAnswerUpdate}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
