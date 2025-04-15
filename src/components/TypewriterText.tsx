
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
  const completedRef = useRef(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    completedRef.current = false;
    console.log("TypewriterText reset for:", text.substring(0, 20) + (text.length > 20 ? "..." : ""));
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete && text.length > 0 && !completedRef.current) { 
      console.log("TypewriterText reached end of text:", text.substring(0, 20) + (text.length > 20 ? "..." : ""));
      setIsComplete(true);
      completedRef.current = true; // Prevent multiple onComplete calls
      
      if (onComplete) {
        // Increased delay to ensure UI updates before callback
        const timeoutId = setTimeout(() => {
          console.log("TypewriterText calling onComplete for:", text.substring(0, 20) + (text.length > 20 ? "..." : ""));
          onComplete();
        }, 500); // Increased delay to ensure reliability
        
        return () => clearTimeout(timeoutId);
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
