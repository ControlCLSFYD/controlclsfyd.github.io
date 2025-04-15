
import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 40, // characters per second
  onComplete,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete && text.length > 0) { // Only trigger onComplete if there's text to type
      setIsComplete(true);
      if (onComplete) {
        // Small delay to ensure UI updates before callback
        setTimeout(() => {
          onComplete();
        }, 50);
      }
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span className={`${className} ${!isComplete ? 'cursor-blink' : ''}`}>
      {displayedText}
    </span>
  );
};

export default TypewriterText;
