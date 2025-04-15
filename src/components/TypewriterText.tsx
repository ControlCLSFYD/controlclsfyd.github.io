
import React, { useState, useEffect, useRef } from 'react';

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
  const onCompleteCalledRef = useRef(false);
  
  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    onCompleteCalledRef.current = false;
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete && text.length > 0) { 
      setIsComplete(true);
      if (onComplete && !onCompleteCalledRef.current) {
        // Increased delay to ensure UI updates before callback
        onCompleteCalledRef.current = true;
        setTimeout(() => {
          console.log("TypewriterText completed:", text.substring(0, 20) + "...");
          onComplete();
        }, 300);
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
