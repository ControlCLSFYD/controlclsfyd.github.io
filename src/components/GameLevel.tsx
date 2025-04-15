
import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import AnswerInput from './AnswerInput';
import CountdownTimer from './CountdownTimer';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

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
  savedAnswers: Record<string, string>;
  onAnswerUpdate: (levelId: number, questionId: string, answer: string) => void;
}

const GameLevel: React.FC<GameLevelProps> = ({
  level,
  questions,
  imageSrc,
  isActive,
  onLevelComplete,
  savedAnswers,
  onAnswerUpdate
}) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [imageKey, setImageKey] = useState<number>(Date.now());

  useEffect(() => {
    // Check if we have any previously answered questions
    const answered = questions
      .filter(q => {
        const answerKey = `${level}-${q.id}`;
        const savedAnswer = savedAnswers[answerKey];
        return savedAnswer && savedAnswer.trim().toLowerCase() === q.answer.toLowerCase();
      })
      .map(q => q.id);
    
    setAnsweredQuestions(answered);
    
    // If all questions are already answered, notify completion
    if (answered.length === questions.length) {
      setLevelComplete(true);
      setTimeout(() => {
        onLevelComplete();
      }, 1000);
    }
  }, [level, questions, savedAnswers, onLevelComplete]);

  useEffect(() => {
    // Ensure the component is focused when it becomes active
    if (isActive && containerRef.current) {
      // Using setTimeout to ensure focus happens after render
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
      
      // Save the answer
      onAnswerUpdate(level, questionId, answer);
      
      // Check if all questions are answered
      if (newAnswered.length === questions.length) {
        setLevelComplete(true);
        // Delay level completion by 1 second
        setTimeout(() => {
          onLevelComplete();
        }, 1000);
      }
    }
  };
  
  const handleReloadImage = () => {
    // Update the imageKey to force React to reload the image
    setImageKey(Date.now());
    
    // Log the reload attempt to confirm functionality
    console.log("Image reload requested at:", new Date().toISOString());
  };

  return (
    <div className="p-4" ref={containerRef}>
      {/* Fixed height header container to prevent layout shifts */}
      <div className="flex justify-between items-center h-[40px] mb-4">
        <TypewriterText 
          text={`LEVEL ${level}`} 
          className="text-xl"
        />
        {isActive && (
          <CountdownTimer 
            initialTime={7 * 60} // 7 minutes in seconds
            isActive={isActive}
          />
        )}
      </div>
      
      {imageSrc && (
        <div className="mb-4 border border-terminal-green p-1 relative">
          <img 
            src={`${imageSrc}?key=${imageKey}`} 
            alt={`Level ${level} Reference`} 
            className="w-full max-h-96 object-contain"
            onError={() => console.log("Image failed to load")}
          />
        </div>
      )}
      
      <div className="space-y-2">
        {questions.map((question) => {
          const answerKey = `${level}-${question.id}`;
          const savedAnswer = savedAnswers[answerKey] || '';
          
          return (
            <div key={question.id} className="mb-4">
              {/* Reduced height container for question text */}
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
      
      {imageSrc && (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReloadImage}
            className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
          >
            <RefreshCw size={16} />
            Reload Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameLevel;
