
import React, { useState, useEffect } from 'react';

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
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);

  useEffect(() => {
    // Check if we have a saved answer that's correct
    if (savedAnswer && checkAnswer(savedAnswer)) {
      setIsCorrect(true);
    }
  }, [savedAnswer]);

  // Calculate character count excluding spaces
  const answerCharCount = correctAnswer.replace(/\s/g, '').length;

  // Generate character placeholders
  const renderCharPlaceholders = () => {
    const placeholder = [];
    let charCount = 0;
    
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] === ' ') {
        placeholder.push(<span key={i} className="mx-1"> </span>);
      } else {
        placeholder.push(<span key={i} className="char-placeholder"></span>);
        charCount++;
      }
    }
    
    return placeholder;
  };

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

  return (
    <div className="mb-4">
      <div className="mb-1">{questionLabel}</div>
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`bg-transparent border p-1 focus:outline-none focus:ring-1 w-full
              ${isCorrect ? 'border-green-500 bg-green-900 bg-opacity-20 text-green-500' : 
                isIncorrect ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-500' : 
                'border-terminal-green text-terminal-green focus:ring-terminal-green'}`}
            disabled={isCorrect}
            placeholder="Type answer here..."
            autoComplete="off"
          />
          {showFeedback && (
            <div className={`absolute right-2 top-1 font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'CORRECT ANSWER' : 'INCORRECT ANSWER'}
            </div>
          )}
        </div>
        {showPlaceholders && (
          <div className="flex">
            {renderCharPlaceholders()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerInput;
