
import React, { useState, useEffect, useRef } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if we have a saved answer that's correct
    if (savedAnswer && checkAnswer(savedAnswer)) {
      setIsCorrect(true);
    }
  }, [savedAnswer]);

  useEffect(() => {
    // Auto-focus the input when the component mounts
    if (inputRef.current && !isCorrect) {
      inputRef.current.focus();
    }
  }, [isCorrect]);

  // Check if the answer is correct
  const checkAnswer = (input: string) => {
    // Case insensitive comparison and trim whitespace
    return input.trim().toLowerCase() === correctAnswer.toLowerCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
    
    // Reset incorrect state when typing
    if (isIncorrect) {
      setIsIncorrect(false);
      setShowFeedback(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (checkAnswer(userAnswer)) {
        setIsCorrect(true);
        setShowFeedback(true);
        onCorrectAnswer();
      } else {
        setIsIncorrect(true);
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setIsIncorrect(false);
        }, 2000); // Hide incorrect feedback after 2 seconds
      }
    }
  };

  // Generate character display that shows both placeholders and user input
  const renderCharacters = () => {
    const characters = [];
    
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] === ' ') {
        // Add space between words
        characters.push(
          <span key={i} className="mx-2"> </span>
        );
      } else {
        // Add character slot with potential user input shown
        const char = i < userAnswer.length ? userAnswer[i] : '';
        characters.push(
          <span 
            key={i} 
            className={`char-placeholder ${char ? 'has-char' : ''} ${
              isCorrect ? 'correct-char' : 
              isIncorrect ? 'incorrect-char' : ''
            }`}
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
      <div className="mb-1">{questionLabel}</div>
      <div className="flex flex-col space-y-2">
        <div className="relative">
          {/* Hidden input field that captures keystrokes */}
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="opacity-0 absolute top-0 left-0 h-full w-full z-10"
            disabled={isCorrect}
            autoComplete="off"
            maxLength={correctAnswer.length}
          />
          
          {/* Visual representation of the answer - removed border */}
          <div 
            className={`flex pt-2 pb-1 px-2 min-h-[40px] cursor-text ${
              isCorrect ? 'bg-green-900 bg-opacity-10' : 
              isIncorrect ? 'bg-red-900 bg-opacity-10' : ''
            }`}
            onClick={() => inputRef.current?.focus()}
          >
            {renderCharacters()}
          </div>
          
          {showFeedback && (
            <div className={`absolute right-2 top-1 font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'CORRECT ANSWER' : 'INCORRECT ANSWER'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;
