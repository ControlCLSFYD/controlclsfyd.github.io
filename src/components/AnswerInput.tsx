
import React, { useState, useEffect } from 'react';

interface AnswerInputProps {
  correctAnswer: string;
  onCorrectAnswer: () => void;
  questionLabel: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ correctAnswer, onCorrectAnswer, questionLabel }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(true);

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
    
    if (checkAnswer(value)) {
      setIsCorrect(true);
      onCorrectAnswer();
    }
  };

  return (
    <div className="mb-4">
      <div className="mb-1">{questionLabel}</div>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          className={`bg-transparent border border-terminal-green text-terminal-green p-1 focus:outline-none focus:ring-1 focus:ring-terminal-green ${isCorrect ? 'bg-terminal-darkGreen bg-opacity-20' : ''}`}
          disabled={isCorrect}
          placeholder="Type answer here..."
          autoComplete="off"
        />
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
