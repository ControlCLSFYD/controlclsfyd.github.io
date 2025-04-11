
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const characterRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Check if we have a saved answer that's correct
    if (savedAnswer && checkAnswer(savedAnswer)) {
      setIsCorrect(true);
    }

    // Initialize the refs array
    characterRefs.current = characterRefs.current.slice(0, correctAnswer.length);
  }, [savedAnswer, correctAnswer]);

  // Check if the answer is correct
  const checkAnswer = (input: string) => {
    // Case insensitive comparison and trim whitespace
    return input.trim().toLowerCase() === correctAnswer.toLowerCase();
  };

  const handleCharChange = (index: number, value: string) => {
    const newUserAnswer = userAnswer.split('');
    
    if (value.length === 0) {
      // Handle backspace/delete
      newUserAnswer[index] = '';
    } else {
      // Take only the first character if multiple are pasted
      newUserAnswer[index] = value.charAt(0);
      
      // Move focus to next character input if available
      if (index < correctAnswer.length - 1 && value.length > 0) {
        setTimeout(() => {
          const nextInput = characterRefs.current[index + 1];
          if (nextInput) {
            nextInput.focus();
            setFocusedIndex(index + 1);
          }
        }, 0);
      }
    }

    const newAnswer = newUserAnswer.join('');
    setUserAnswer(newAnswer);
    
    // Reset incorrect state when typing
    if (isIncorrect) {
      setIsIncorrect(false);
      setShowFeedback(false);
    }

    // Check if answer is complete and correct
    if (newAnswer.length === correctAnswer.replace(/\s/g, '').length && checkAnswer(newAnswer)) {
      setIsCorrect(true);
      setShowFeedback(true);
      onCorrectAnswer();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
    } else if (e.key === 'Backspace' && index > 0 && !userAnswer[index]) {
      // Move focus to previous character input if current is empty
      setTimeout(() => {
        const prevInput = characterRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          setFocusedIndex(index - 1);
        }
      }, 0);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move focus to previous input on left arrow
      setTimeout(() => {
        const prevInput = characterRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          setFocusedIndex(index - 1);
        }
      }, 0);
    } else if (e.key === 'ArrowRight' && index < correctAnswer.length - 1) {
      // Move focus to next input on right arrow
      setTimeout(() => {
        const nextInput = characterRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          setFocusedIndex(index + 1);
        }
      }, 0);
    }
  };

  // Generate character inputs for the answer
  const renderCharInputs = () => {
    const inputs = [];
    let charIndex = 0;
    
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] === ' ') {
        inputs.push(
          <div key={`space-${i}`} className="mx-2">
            &nbsp;
          </div>
        );
      } else {
        const index = charIndex;
        inputs.push(
          <div key={`char-${i}`} className="char-input-container">
            <input
              ref={el => characterRefs.current[index] = el}
              type="text"
              maxLength={1}
              className={`char-input w-8 h-8 text-center border-b-2 mx-1 bg-transparent focus:outline-none
                ${isCorrect ? 'border-green-500 text-green-500' : 
                  isIncorrect ? 'border-red-500 text-red-500' : 
                  'border-terminal-green text-terminal-green focus:border-terminal-green'}`}
              value={userAnswer[index] || ''}
              onChange={(e) => handleCharChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isCorrect}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
            />
          </div>
        );
        charIndex++;
      }
    }
    
    return inputs;
  };

  return (
    <div className="mb-4">
      <div className="mb-1">{questionLabel}</div>
      <div className="space-y-2">
        <div className="relative">
          <div className="flex flex-wrap items-center">
            {renderCharInputs()}
          </div>
          {showFeedback && (
            <div className={`mt-2 font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'CORRECT ANSWER' : 'INCORRECT ANSWER'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;
