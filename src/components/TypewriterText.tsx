
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    completedRef.current = false;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    console.log("TypewriterText reset for:", text.substring(0, 20) + (text.length > 20 ? "..." : ""));
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Store the timeout in the ref so we can clear it if needed
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 1000 / speed); // Convert speed to milliseconds per character

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else if (!isComplete && text.length > 0 && !completedRef.current) { 
      console.log("TypewriterText reached end of text:", text.substring(0, 20) + (text.length > 20 ? "..." : ""));
      setIsComplete(true);
      completedRef.current = true; // Prevent multiple onComplete calls
      
      if (onComplete) {
        // Increased delay to ensure UI updates before callback
        timeoutRef.current = setTimeout(() => {
          console.log("TypewriterText calling onComplete for:", text.substring(0, 20) + (text.length > 20 ? "..." : ""));
          onComplete();
        }, 1000); // Increased delay to ensure reliability
        
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
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
