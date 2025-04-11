
import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import AnswerInput from './AnswerInput';
import CountdownTimer from './CountdownTimer';

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
  }, [level, questions, savedAnswers]);

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

  return (
    <div className="p-4" ref={containerRef}>
      <div className="flex justify-between items-center mb-4">
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
        <div className="mb-4 border border-terminal-green p-1">
          <img src={imageSrc} alt={`Level ${level} Reference`} className="w-full max-h-96 object-contain" />
        </div>
      )}
      
      <div className="space-y-6">
        {questions.map((question) => {
          const answerKey = `${level}-${question.id}`;
          const savedAnswer = savedAnswers[answerKey] || '';
          
          return (
            <div key={question.id} className="mb-6">
              <TypewriterText 
                text={question.text} 
                className="block mb-4"
              />
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
    </div>
  );
};

export default GameLevel;
