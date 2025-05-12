
import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import AnswerInput from './AnswerInput';
import CountdownTimer from './CountdownTimer';
import { Button } from './ui/button';
import { RefreshCw, Image, Play, X, Keyboard } from 'lucide-react';
import LessonModal from './LessonModal';
import { LessonContent } from './LessonScreen';
import { lessonData } from '../data/gameData';
import GameOverScreen from './GameOverScreen';
import { useIsMobile } from '../hooks/use-mobile';

export interface Question {
  id: string;
  text: string;
  answer: string;
}

interface GameLevelProps {
  level: number;
  questions: Question[];
  imageSrc?: string;
  isActive: boolean;
  onLevelComplete: () => void;
  onRestart: () => void;
  savedAnswers: Record<string, string>;
  onAnswerUpdate: (levelId: number, questionId: string, answer: string) => void;
}

const GameLevel: React.FC<GameLevelProps> = ({
  level,
  questions,
  imageSrc,
  isActive,
  onLevelComplete,
  onRestart,
  savedAnswers,
  onAnswerUpdate
}) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [imageKey, setImageKey] = useState<number>(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playsRemaining, setPlaysRemaining] = useState<number>(2);
  const [displayedCode, setDisplayedCode] = useState<string>("");
  const [spacebarPressed, setSpacebarPressed] = useState<boolean>(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const getTimerDuration = (level: number): number => {
    switch (level) {
      case 1: return 7 * 60; // 7 minutes
      case 2: return Math.floor(5.5 * 60); // 5:30 minutes
      case 3: return 4 * 60; // 4 minutes
      case 4: return 3 * 60; // 3 minutes
      case 5: return 5 * 60; // 5 minutes for Level 5
      default: return 7 * 60; // Default to 7 minutes
    }
  };

  const timerDuration = getTimerDuration(level);

  const levelLesson = lessonData.find(lesson => lesson.id === level) || lessonData[0];

  useEffect(() => {
    const answered = questions
      .filter(q => {
        const answerKey = `${level}-${q.id}`;
        const savedAnswer = savedAnswers[answerKey];
        return savedAnswer && savedAnswer.trim().toLowerCase() === q.answer.toLowerCase();
      })
      .map(q => q.id);
    
    setAnsweredQuestions(answered);
    
    if (answered.length === questions.length) {
      setLevelComplete(true);
      setTimeout(() => {
        onLevelComplete();
      }, 1000);
    }
  }, [level, questions, savedAnswers, onLevelComplete]);

  useEffect(() => {
    if (isActive && containerRef.current) {
      setTimeout(() => {
        const firstInput = containerRef.current?.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [isActive]);

  const handleCorrectAnswer = (questionId: string, answer: string) => {
    if (!answeredQuestions.includes(questionId)) {
      const newAnswered = [...answeredQuestions, questionId];
      setAnsweredQuestions(newAnswered);
      
      onAnswerUpdate(level, questionId, answer);
      
      if (newAnswered.length === questions.length) {
        setLevelComplete(true);
        setTimeout(() => {
          onLevelComplete();
        }, 1000);
      }
    }
  };
  
  const handleReloadImage = () => {
    setImageLoaded(false);
    setImageError(false);
    
    setImageKey(Date.now());
    
    console.log("Image reload requested at:", new Date().toISOString());
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    console.log("Image failed to load");
  };
  
  const handleTimeUp = () => {
    setTimeExpired(true);
  };

  // Morse code related functionality for Level 5
  const playMorseCodeAudio = () => {
    if (level !== 5 || playsRemaining <= 0) return;
    
    setIsPlaying(true);
    
    // Here you would normally play the audio file
    console.log("Playing morse code for 'Berlusconi'");
    
    // Simulate audio playback time (5 seconds)
    setTimeout(() => {
      setIsPlaying(false);
      setPlaysRemaining(prev => prev - 1);
    }, 5000);
  };

  // Morse code input handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (level !== 5 || !isActive) return;
    
    if (e.code === 'Space' && !spacebarPressed) {
      e.preventDefault();
      setSpacebarPressed(true);
      setPressStartTime(Date.now());
    }
    
    if (e.code === 'Backspace' && displayedCode.length > 0) {
      e.preventDefault();
      setDisplayedCode(prev => prev.slice(0, -1));
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (level !== 5 || !isActive) return;
    
    if (e.code === 'Space' && spacebarPressed && pressStartTime) {
      e.preventDefault();
      const pressDuration = Date.now() - pressStartTime;
      
      let symbol = '';
      if (pressDuration < 300) {
        symbol = '.';
      } else {
        symbol = '-';
      }
      
      const updatedCode = displayedCode + symbol;
      setDisplayedCode(updatedCode);
      
      setSpacebarPressed(false);
      setPressStartTime(null);
    }
  };

  const handleSpaceButtonDown = () => {
    if (level !== 5 || !isActive) return;
    
    setSpacebarPressed(true);
    setPressStartTime(Date.now());
  };

  const handleSpaceButtonUp = () => {
    if (level !== 5 || !isActive || !pressStartTime) return;
    
    const pressDuration = Date.now() - pressStartTime;
    
    let symbol = '';
    if (pressDuration < 300) {
      symbol = '.';
    } else {
      symbol = '-';
    }
    
    const updatedCode = displayedCode + symbol;
    setDisplayedCode(updatedCode);
    
    setSpacebarPressed(false);
    setPressStartTime(null);
  };

  const handleBackspaceClick = () => {
    if (level !== 5 || !isActive) return;
    
    if (displayedCode.length > 0) {
      setDisplayedCode(prev => prev.slice(0, -1));
    }
  };

  const handleMorseSubmit = (questionId: string) => {
    // Define the Morse code for "Berlusconi" without spaces
    const morseCodeForBerlusconi = "-...-.-..-...-...-.-.----.-..-"; // Morse code without spaces
    
    // Compare input with the correct answer without spaces
    if (displayedCode === morseCodeForBerlusconi) {
      handleCorrectAnswer(questionId, "Berlusconi");
    }
  };

  if (timeExpired) {
    return <GameOverScreen onRestart={onRestart} />;
  }

  // Render special layout for Level 5 with Morse code functionality
  if (level === 5) {
    return (
      <div className="p-4" ref={containerRef} tabIndex={0} style={{ outline: 'none' }}
           onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
        <div className="flex justify-between items-center h-[40px] mb-4">
          <TypewriterText 
            text={`LEVEL ${level}`} 
            className="text-xl"
          />
          {isActive && (
            <CountdownTimer 
              initialTime={timerDuration} 
              isActive={isActive}
              onTimeUp={handleTimeUp}
            />
          )}
        </div>
        
        {/* Question text */}
        <div className="min-h-[40px] mb-4">
          <TypewriterText 
            text={questions[0].text} 
            className="text-2xl font-bold block"
          />
        </div>
        
        {/* Image */}
        {imageSrc && (
          <div className="mb-4 border border-terminal-green p-1 relative">
            {!imageLoaded && !imageError && (
              <div className="w-full h-64 flex items-center justify-center text-terminal-green">
                Loading image...
              </div>
            )}
            
            {imageError && (
              <div className="w-full h-64 flex flex-col items-center justify-center text-terminal-green">
                <div className="mb-2">Failed to load image</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReloadImage}
                  className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
                >
                  Try Again
                </Button>
              </div>
            )}
            
            <img 
              src={`${imageSrc}?key=${imageKey}`} 
              alt={`Level ${level} Reference`} 
              className={`w-full max-h-96 object-contain ${!imageLoaded ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}
        
        {/* Morse code controls */}
        <div className="max-w-md w-full mx-auto text-center space-y-8 mb-6">
          <div className="space-y-6">
            {/* Play button */}
            <button
              onClick={playMorseCodeAudio}
              disabled={playsRemaining <= 0 || isPlaying}
              className="h-16 w-16 bg-terminal-black border border-terminal-green flex items-center justify-center mx-auto"
              aria-label="Play Morse Code"
            >
              <Play size={32} className="text-terminal-green" />
            </button>
            
            {isPlaying && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-terminal-green rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-ping animation-delay-200"></div>
                <div className="w-1 h-1 bg-terminal-green rounded-full animate-ping animation-delay-400"></div>
              </div>
            )}
            
            <p className="text-sm">
              You can play the message {playsRemaining} more times.
            </p>
            
            {/* Morse code display */}
            <div className="h-32 border border-terminal-green bg-terminal-black/30 rounded-md flex items-center justify-center overflow-hidden relative">
              {displayedCode ? (
                <div className="flex items-center">
                  <p className="text-3xl font-mono tracking-wider animate-pulse">
                    {displayedCode}
                    <span className="animate-blink ml-1">_</span>
                  </p>
                  <button 
                    onClick={handleBackspaceClick}
                    className="ml-4 p-2 rounded-full hover:bg-terminal-black/40"
                    aria-label="Delete"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-lg opacity-50">
                  Press spacebar to begin...
                  <span className="animate-blink ml-1">_</span>
                </p>
              )}
            </div>
            
            <div className="text-sm opacity-70 mb-2">
              <span className="mr-4">Short spacebar press = · (dot)</span>
              <span className="mr-4">Long spacebar press = - (dash)</span>
              <span>No need for spaces between letters</span>
            </div>
            
            {/* Mobile spacebar button */}
            {isMobile && (
              <div className="w-full flex flex-col gap-3 mt-4">
                <Button
                  variant="outline"
                  className="h-16 text-lg border border-terminal-green flex items-center justify-center bg-terminal-black/20"
                  onTouchStart={handleSpaceButtonDown}
                  onTouchEnd={handleSpaceButtonUp}
                  onMouseDown={handleSpaceButtonDown}
                  onMouseUp={handleSpaceButtonUp}
                >
                  <Keyboard className="mr-2" size={24} />
                  SPACEBAR
                </Button>
                
                <Button
                  variant="outline"
                  className="h-12 text-lg border border-terminal-green flex items-center justify-center bg-terminal-black/20"
                  onClick={handleBackspaceClick}
                >
                  <X className="mr-2" size={24} />
                  DELETE
                </Button>
              </div>
            )}
            
            {/* Submit button */}
            <button
              onClick={() => handleMorseSubmit(questions[0].id)}
              disabled={displayedCode.trim() === ''}
              className="mt-4 w-full border border-terminal-green bg-terminal-black hover:bg-terminal-black/70 text-terminal-green py-2 px-4 rounded-md transition-colors"
            >
              Submit Answer
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex flex-col items-center">
          <LessonModal lesson={levelLesson} />
          
          {imageSrc && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReloadImage}
              className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black mt-2"
            >
              <RefreshCw size={16} />
              Reload Image
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default layout for other levels
  return (
    <div className="p-4" ref={containerRef}>
      <div className="flex justify-between items-center h-[40px] mb-4">
        <TypewriterText 
          text={`LEVEL ${level}`} 
          className="text-xl"
        />
        {isActive && (
          <CountdownTimer 
            initialTime={timerDuration} 
            isActive={isActive}
            onTimeUp={handleTimeUp}
          />
        )}
      </div>
      
      {imageSrc && (
        <div className="mb-4 border border-terminal-green p-1 relative">
          {!imageLoaded && !imageError && (
            <div className="w-full h-64 flex items-center justify-center text-terminal-green">
              Loading image...
            </div>
          )}
          
          {imageError && (
            <div className="w-full h-64 flex flex-col items-center justify-center text-terminal-green">
              <div className="mb-2">Failed to load image</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReloadImage}
                className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <img 
            src={`${imageSrc}?key=${imageKey}`} 
            alt={`Level ${level} Reference`} 
            className={`w-full max-h-96 object-contain ${!imageLoaded ? 'hidden' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
      
      <div className="space-y-2">
        {questions.map((question) => {
          const answerKey = `${level}-${question.id}`;
          const savedAnswer = savedAnswers[answerKey] || '';
          
          return (
            <div key={question.id} className="mb-4">
              <div className="min-h-[40px] mb-1">
                <TypewriterText 
                  text={question.text} 
                  className="block"
                />
              </div>
              <AnswerInput 
                correctAnswer={question.answer} 
                onCorrectAnswer={() => handleCorrectAnswer(question.id, savedAnswer || question.answer)}
                questionLabel={`Answer for ${question.id}`}
                savedAnswer={savedAnswer}
              />
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <LessonModal lesson={levelLesson} />
        
        {imageSrc && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReloadImage}
            className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
          >
            <RefreshCw size={16} />
            Reload Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameLevel;
