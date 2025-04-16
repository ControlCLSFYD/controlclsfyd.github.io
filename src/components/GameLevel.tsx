
import React, { useState, useEffect, useRef } from 'react';
import GameHeader from './game/GameHeader';
import GameImage from './game/GameImage';
import GameQuestions from './game/GameQuestions';
import GameControls from './game/GameControls';
import { lessonData } from '../data/gameData';
import { getTimerDuration } from '../utils/levelTimers';

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
  
  // Get the timer duration for this level
  const timerDuration = getTimerDuration(level);

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
  
  // Handle image reload through reference to the GameImage component
  const handleReloadImage = () => {
    // This is now handled in the GameImage component
    console.log("Reload image requested from GameLevel");
  };

  return (
    <div className="p-4" ref={containerRef}>
      {/* Game header with level title and timer */}
      <GameHeader 
        level={level} 
        isActive={isActive} 
        timerDuration={timerDuration} 
      />
      
      {/* Game image if provided */}
      {imageSrc && <GameImage imageSrc={imageSrc} />}
      
      {/* Game questions */}
      <GameQuestions 
        questions={questions} 
        level={level} 
        savedAnswers={savedAnswers}
        onCorrectAnswer={handleCorrectAnswer} 
      />
      
      {/* Game controls for help and image reload */}
      <GameControls 
        imageSrc={imageSrc}
        handleReloadImage={imageSrc ? handleReloadImage : undefined}
        levelLesson={levelLesson}
      />
    </div>
  );
};

export default GameLevel;
