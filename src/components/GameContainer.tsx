
import React, { useState, useEffect } from 'react';
import GameLevel from './GameLevel';
import TypewriterText from './TypewriterText';
import { gameLevels } from '../data/gameData';

interface GameContainerProps {
  savedAnswers: Record<string, string>;
  onAnswerUpdate: (levelId: number, questionId: string, answer: string) => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ savedAnswers, onAnswerUpdate }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [showAccessCodePrompt, setShowAccessCodePrompt] = useState(false);
  const [showInitializing, setShowInitializing] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    // Show loading dots animation
    const dotTimeout = setTimeout(() => {
      setLoadingDots("...");
    }, 1000);

    // Show initializing text after dots
    const initTimeout = setTimeout(() => {
      setShowInitializing(true);
    }, 2500);

    // Show access code prompt
    const promptTimeout = setTimeout(() => {
      setShowAccessCodePrompt(true);
    }, 5000);

    return () => {
      clearTimeout(dotTimeout);
      clearTimeout(initTimeout);
      clearTimeout(promptTimeout);
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

  return (
    <div className="terminal p-4">
      {!gameStarted ? (
        <div className="flex flex-col items-start">
          <div className="mb-8">
            <span>{loadingDots}</span>
          </div>
          {showInitializing && (
            <div className="mb-8">
              <TypewriterText text="CLSFYD Challenge Initializing..." />
            </div>
          )}
          {showAccessCodePrompt && (
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
