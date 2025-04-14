import React, { useState, useEffect } from 'react';
import GameLevel from './GameLevel';
import TypewriterText from './TypewriterText';
import PongGame from './PongGame';
import OxoGame from './OxoGame';
import SpacewarGame from './SpacewarGame';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import PixelArtLogo from './PixelArtLogo';
import { gameLevels } from '../data/gameData';
import { getRandomPsalm, endScreenPsalm } from '../utils/psalms';

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
  const [pongDifficulty, setPongDifficulty] = useState(1);
  const [showOxoGame, setShowOxoGame] = useState(false);
  const [oxoCompleted, setOxoCompleted] = useState(false);
  const [oxoDifficulty, setOxoDifficulty] = useState(1);
  const [showSpacewarGame, setShowSpacewarGame] = useState(false);
  const [spacewarCompleted, setSpacewarCompleted] = useState(false);
  const [spacewarDifficulty, setSpacewarDifficulty] = useState(1);
  const [showTetrisGame, setShowTetrisGame] = useState(false);
  const [tetrisCompleted, setTetrisCompleted] = useState(false);
  const [tetrisDifficulty, setTetrisDifficulty] = useState(1);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [snakeCompleted, setSnakeCompleted] = useState(false);
  const [snakeDifficulty, setSnakeDifficulty] = useState(1);
  const [randomPsalm, setRandomPsalm] = useState("");
  const [showEndScreenPsalm, setShowEndScreenPsalm] = useState(false);

  useEffect(() => {
    const dotTimeout = setTimeout(() => {
      setLoadingStep(2); // Show loading dots
    }, 1000);

    const initTimeout = setTimeout(() => {
      setLoadingStep(3); // Show initializing text
    }, 2500);

    const codeTimeout = setTimeout(() => {
      setLoadingStep(4); // Show access code prompt
      setRandomPsalm(getRandomPsalm()); // Set a random psalm when showing access code
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
      
      if (newCompletedLevels.includes(3) && currentLevel >= 4 && !tetrisCompleted) {
        setTetrisCompleted(true);
      }
      
      if (newCompletedLevels.includes(4) && currentLevel >= 5 && !snakeCompleted) {
        setSnakeCompleted(true);
      }
      
      if (gameStarted && currentLevel >= 1 && !oxoCompleted) {
        setOxoCompleted(true);
      }
    }
  }, [savedAnswers, currentLevel, pongCompleted, spacewarCompleted, tetrisCompleted, snakeCompleted, gameStarted, oxoCompleted]);

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

  const handleOxoPlayAgain = () => {
    setOxoDifficulty(prev => Math.min(prev + 1, 5)); // Increase difficulty up to max of 5
    setShowOxoGame(true);
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
    else if (currentLevel === 3 && !tetrisCompleted) {
      setShowTetrisGame(true);
    }
    else if (currentLevel === 4 && !snakeCompleted) {
      setShowSnakeGame(true);
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

  const handlePongPlayAgain = (playerWon: boolean) => {
    if (playerWon) {
      setPongDifficulty(prev => Math.min(prev + 1, 5)); // Increase difficulty up to max of 5
    }
    setShowPongGame(true);
  };

  const handleSpacewarComplete = () => {
    setSpacewarCompleted(true);
    setShowSpacewarGame(false);
    setCurrentLevel(3);
  };

  const handleSpacewarPlayAgain = () => {
    setSpacewarDifficulty(prev => Math.min(prev + 1, 5)); // Increase difficulty up to max of 5
    setShowSpacewarGame(true);
  };

  const handleTetrisComplete = () => {
    setTetrisCompleted(true);
    setShowTetrisGame(false);
    setCurrentLevel(4);
  };

  const handleTetrisPlayAgain = () => {
    setTetrisDifficulty(prev => Math.min(prev + 1, 5)); // Increase difficulty up to max of 5
    setShowTetrisGame(true);
  };

  const handleSnakeComplete = () => {
    setSnakeCompleted(true);
    setShowSnakeGame(false);
    setCurrentLevel(5);
  };

  const handleSnakePlayAgain = () => {
    setSnakeDifficulty(prev => Math.min(prev + 1, 5)); // Increase difficulty up to max of 5
    setShowSnakeGame(true);
  };

  const handleEndMessageComplete = () => {
    setShowEndScreenPsalm(true);
  };

  const isGameActive = showPongGame || showOxoGame || showSpacewarGame || showTetrisGame || showSnakeGame;

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
            <TypewriterText text="Enter your access code." className="mb-4 block" />
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
            
            {randomPsalm && (
              <div className="mt-12 text-terminal-green opacity-70 max-w-lg whitespace-pre-line">
                "{randomPsalm}"
              </div>
            )}
            
            <PixelArtLogo />
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
          {gameCompleted ? (
            <div className="p-4">
              <TypewriterText
                text="Congratulations! That wasn't easy. You should email control@classifiedaccessories.com a hello message with your CV and the code: 112233YD. To buy Protection from the Game, and access Level 2, please purchase a CLSFYD Product."
                className="text-xl"
                onComplete={handleEndMessageComplete}
              />
              {showEndScreenPsalm && (
                <div className="mt-12 text-terminal-green opacity-70 max-w-lg whitespace-pre-line">
                  "{endScreenPsalm}"
                </div>
              )}
            </div>
          ) : showOxoGame ? (
            <OxoGame 
              onGameComplete={handleOxoComplete} 
              onPlayAgain={handleOxoPlayAgain} 
              difficulty={oxoDifficulty}
            />
          ) : showPongGame ? (
            <PongGame 
              onGameComplete={handlePongComplete} 
              onPlayAgain={handlePongPlayAgain}
              difficulty={pongDifficulty}
            />
          ) : showSpacewarGame ? (
            <SpacewarGame 
              onGameComplete={handleSpacewarComplete} 
              onPlayAgain={handleSpacewarPlayAgain}
              difficulty={spacewarDifficulty}
            />
          ) : showTetrisGame ? (
            <TetrisGame 
              onGameComplete={handleTetrisComplete} 
              onPlayAgain={handleTetrisPlayAgain}
              difficulty={tetrisDifficulty}
            />
          ) : showSnakeGame ? (
            <SnakeGame 
              onGameComplete={handleSnakeComplete} 
              onPlayAgain={handleSnakePlayAgain}
              difficulty={snakeDifficulty}
            />
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
