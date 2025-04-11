
import React, { useState, useEffect } from 'react';
import GameLevel from './GameLevel';
import TypewriterText from './TypewriterText';
import PongGame from './PongGame';
import OxoGame from './OxoGame';
import SpacewarGame from './SpacewarGame';
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
  const [showPongGame, setShowPongGame] = useState(false);
  const [pongCompleted, setPongCompleted] = useState(false);
  const [showOxoGame, setShowOxoGame] = useState(false);
  const [oxoCompleted, setOxoCompleted] = useState(false);
  const [showSpacewarGame, setShowSpacewarGame] = useState(false);
  const [spacewarCompleted, setSpacewarCompleted] = useState(false);

  useEffect(() => {
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
      
      if (newCompletedLevels.includes(1) && currentLevel >= 2 && !pongCompleted) {
        setPongCompleted(true);
      }
      
      if (newCompletedLevels.includes(2) && currentLevel >= 3 && !spacewarCompleted) {
        setSpacewarCompleted(true);
      }
      
      if (gameStarted && currentLevel >= 1 && !oxoCompleted) {
        setOxoCompleted(true);
      }
    }
  }, [savedAnswers, currentLevel, pongCompleted, spacewarCompleted, gameStarted, oxoCompleted]);

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "111") {
      onResetGame();
      setGameStarted(true);
      setShowOxoGame(true);
    }
  };

  const handleOxoComplete = () => {
    setOxoCompleted(true);
    setShowOxoGame(false);
    setCurrentLevel(1);
  };

  const handleLevelComplete = () => {
    if (!completedLevels.includes(currentLevel)) {
      setCompletedLevels(prev => [...prev, currentLevel]);
    }
    
    if (currentLevel === 1 && !pongCompleted) {
      setShowPongGame(true);
    } 
    else if (currentLevel === 2 && !spacewarCompleted) {
      setShowSpacewarGame(true);
    }
    else if (currentLevel < gameLevels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setGameCompleted(true);
    }
  };

  const handlePongComplete = () => {
    setPongCompleted(true);
    setShowPongGame(false);
    setCurrentLevel(2);
  };

  const handleSpacewarComplete = () => {
    setSpacewarCompleted(true);
    setShowSpacewarGame(false);
    setCurrentLevel(3);
  };

  // Removed navigation functions and associated state

  const isGameActive = showPongGame || showOxoGame || showSpacewarGame;

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
          {/* Navigation buttons removed */}

          {gameCompleted ? (
            <div className="p-4">
              <TypewriterText
                text="Thank you for completing Level 1 of the CLSFYD Game (Pre-Alpha). Please purchase a CLSFYD Product to gain access to Level 2 of the Game."
                className="text-xl"
              />
            </div>
          ) : showOxoGame ? (
            <OxoGame onGameComplete={handleOxoComplete} />
          ) : showPongGame ? (
            <PongGame onGameComplete={handlePongComplete} />
          ) : showSpacewarGame ? (
            <SpacewarGame onGameComplete={handleSpacewarComplete} />
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
