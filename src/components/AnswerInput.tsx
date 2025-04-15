import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface AnswerInputProps {
  correctAnswer: string;
  onCorrectAnswer: () => void;
  questionLabel: string;
  savedAnswer?: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ 
  correctAnswer, 
  onCorrectAnswer, 
  questionLabel,
  savedAnswer = ''
}) => {
  const [userAnswer, setUserAnswer] = useState(savedAnswer);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(savedAnswer.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const remainingChars = correctAnswer.length - userAnswer.length;

  useEffect(() => {
    if (savedAnswer && checkAnswer(savedAnswer)) {
      setIsCorrect(true);
    }
  }, [savedAnswer]);

  useEffect(() => {
    if (inputRef.current && !isCorrect) {
      inputRef.current.focus();
    }
  }, [isCorrect]);
  
  const updateCursorPosition = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || userAnswer.length);
    }
  };

  const checkAnswer = (input: string) => {
    return input.trim().toLowerCase() === correctAnswer.toLowerCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.substring(0, correctAnswer.length);
    setUserAnswer(value);
    updateCursorPosition();
    
    if (isIncorrect) {
      setIsIncorrect(false);
      setShowFeedback(false);
    }
    
    if (checkAnswer(value)) {
      setIsCorrect(true);
      setShowFeedback(true);
      setTimeout(() => {
        onCorrectAnswer();
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (checkAnswer(userAnswer)) {
        setIsCorrect(true);
        setShowFeedback(true);
        setTimeout(() => {
          onCorrectAnswer();
        }, 1000);
      } else {
        setIsIncorrect(true);
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setIsIncorrect(false);
        }, 2000);
      }
    } else {
      setTimeout(updateCursorPosition, 0);
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (inputRef.current && !isCorrect) {
      inputRef.current.focus();
      
      const containerRect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - containerRect.left;
      
      const charWidth = 12;
      const estimatedPosition = Math.min(
        Math.max(Math.floor(clickX / charWidth), 0),
        correctAnswer.length
      );
      
      inputRef.current.setSelectionRange(estimatedPosition, estimatedPosition);
      setCursorPosition(estimatedPosition);
    }
  };
  
  const handleFocus = () => {
    updateCursorPosition();
  };

  const renderCharacters = () => {
    const characters = [];
    
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] === ' ') {
        characters.push(
          <span key={i} className="mx-2"> </span>
        );
      } else {
        const isCursorHere = i === cursorPosition && !isCorrect;
        const char = i < userAnswer.length ? userAnswer[i] : '';
        characters.push(
          <span 
            key={i} 
            className={`char-placeholder ${char ? 'has-char' : ''} ${
              isCorrect ? 'correct-char' : 
              isIncorrect ? 'incorrect-char' : ''
            } ${isCursorHere ? 'cursor-position' : ''}`}
          >
            {char || ''}
          </span>
        );
      }
    }
    
    return characters;
  };

  return (
    <div className="mb-4">
      <div className="mb-1">{questionLabel} (select the line, then type your answer)</div>
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="opacity-0 absolute top-0 left-0 h-full w-full z-10"
            disabled={isCorrect}
            autoComplete="off"
            maxLength={correctAnswer.length}
          />
          
          <div 
            className={`flex pt-3 pb-2 px-2 min-h-[50px] cursor-text ${isMobile ? 'min-h-[60px]' : ''} ${
              isCorrect ? 'bg-green-900 bg-opacity-10' : 
              isIncorrect ? 'bg-red-900 bg-opacity-10' : ''
            }`}
            onClick={handleClick}
          >
            {renderCharacters()}
          </div>
          
          <div className={`text-xs absolute right-2 bottom-[-20px] ${
            remainingChars > 0 
              ? 'text-terminal-green' 
              : remainingChars === 0 
                ? 'text-terminal-green animate-pulse font-bold' 
                : 'text-red-500'
          }`}>
            {remainingChars >= 0 ? `${remainingChars}` : '✖'}
          </div>
          
          {showFeedback && (
            <div className={`relative mt-2 font-bold text-center md:text-right md:absolute md:right-2 ${isMobile ? 'top-full pt-2' : 'md:top-1 md:mt-0'}`}>
              <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                {isCorrect ? 'CORRECT ANSWER' : 'INCORRECT ANSWER'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;
