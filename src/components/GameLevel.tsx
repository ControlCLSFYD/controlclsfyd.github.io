
import React, { useState, useEffect, useRef } from 'react';
import { LessonContent } from './LessonScreen';
import { lessonData } from '../data/lessonData';
import GameHeader from './GameHeader';
import GameImage from './GameImage';
import GameQuestions from './GameQuestions';
import GameActions from './GameActions';

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
  
  // Find the appropriate lesson for this level
  const levelLesson = lessonData.find(lesson => lesson.id === level) || lessonData[0];

  // Set timer duration based on level - 1 minute for Level 5, 7 minutes for others
  const timerDuration = level === 5 ? 60 : 7 * 60; // 1 minute or 7 minutes in seconds
  
  // Calculate progress as percentage of answered questions
  const progress = questions.length > 0 
    ? (answeredQuestions.length / questions.length) * 100 
    : 0;

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
    // This will be passed to the GameImage component through GameActions
    console.log("Reload image requested from GameLevel");
  };

  return (
    <div className="p-4" ref={containerRef}>
      {/* Level Header with Timer and Progress */}
      <GameHeader 
        level={level} 
        isActive={isActive} 
        timerDuration={timerDuration}
        progress={progress}
      />
      
      {/* Level Image (if any) */}
      <GameImage imageSrc={imageSrc} />
      
      {/* Level Questions */}
      <GameQuestions
        level={level}
        questions={questions}
        savedAnswers={savedAnswers}
        onAnswerUpdate={onAnswerUpdate}
        onCorrectAnswer={handleCorrectAnswer}
      />
      
      {/* Actions (Help and Reload Image) */}
      <GameActions 
        lesson={levelLesson} 
        hasImage={!!imageSrc} 
        onReloadImage={handleReloadImage} 
      />
    </div>
  );
};

export default GameLevel;
