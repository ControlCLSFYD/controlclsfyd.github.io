import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import AnswerInput from './AnswerInput';
import CountdownTimer from './CountdownTimer';
import { Button } from './ui/button';
import { RefreshCw, Image } from 'lucide-react';
import LessonModal from './LessonModal';
import { LessonContent } from './LessonScreen';
import { lessonData } from '../data/gameData';
import GameOverScreen from './GameOverScreen';

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

  const getTimerDuration = (level: number): number => {
    switch (level) {
      case 1: return 7 * 60; // 7 minutes
      case 2: return Math.floor(5.5 * 60); // 5:30 minutes
      case 3: return 4 * 60; // 4 minutes
      case 4: return 3 * 60; // 3 minutes
      case 5: return Math.floor(1.5 * 60); // 1:30 minutes
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

  if (timeExpired) {
    return <GameOverScreen onRestart={onRestart} />;
  }

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
