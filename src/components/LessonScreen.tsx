
import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

export interface LessonContent {
  id: number;
  title: string;
  content: string[];
}

interface LessonScreenProps {
  lesson: LessonContent;
  onComplete: () => void;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete }) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [titleComplete, setTitleComplete] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [isDebugMode] = useState(false); // Debug mode toggle for quick testing
  const paragraphsRef = useRef<HTMLDivElement>(null);

  // Reset typing state when lesson changes
  useEffect(() => {
    setCurrentParagraphIndex(0);
    setTitleComplete(false);
    setTypingComplete(false);
    console.log("Lesson Screen reset for lesson:", lesson.id);
  }, [lesson.id]);

  // For debug mode - instantly complete the lesson
  useEffect(() => {
    if (isDebugMode) {
      setTitleComplete(true);
      setCurrentParagraphIndex(lesson.content.length - 1);
      setTypingComplete(true);
    }
  }, [isDebugMode, lesson.content.length]);

  const handleTitleComplete = () => {
    console.log("Title completed for lesson:", lesson.id);
    setTitleComplete(true);
  };

  const handleParagraphComplete = () => {
    console.log("Paragraph completed:", currentParagraphIndex, "of", lesson.content.length - 1);
    
    // Make sure we're not at the end of the content array
    if (currentParagraphIndex < lesson.content.length - 1) {
      // Set a timeout before advancing to next paragraph
      setTimeout(() => {
        console.log("Advancing to next paragraph:", currentParagraphIndex + 1);
        setCurrentParagraphIndex(prevIndex => prevIndex + 1);
        
        // Scroll to the bottom if needed
        if (paragraphsRef.current) {
          paragraphsRef.current.scrollTop = paragraphsRef.current.scrollHeight;
        }
      }, 500); // Increased for reliability
    } else {
      console.log("All paragraphs completed, setting typingComplete to true");
      setTypingComplete(true);
    }
  };

  return (
    <div className="flex flex-col items-start p-4 max-w-3xl mx-auto">
      <div className="mb-6 w-full">
        <h2 className="text-xl text-terminal-green mb-4">
          <TypewriterText
            text={`LESSON ${lesson.id}: ${lesson.title.toUpperCase()}`}
            speed={30}
            onComplete={handleTitleComplete}
          />
        </h2>
        
        <div 
          className="space-y-4 text-left overflow-y-auto max-h-[60vh]"
          ref={paragraphsRef}
        >
          {titleComplete && (
            <>
              {lesson.content.map((paragraph, index) => (
                <div key={index} className="mb-4" style={{ display: index <= currentParagraphIndex ? 'block' : 'none' }}>
                  {index === currentParagraphIndex ? (
                    <TypewriterText
                      text={paragraph}
                      speed={20}
                      onComplete={handleParagraphComplete}
                    />
                  ) : (
                    <span>{paragraph}</span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      
      {typingComplete && (
        <div className="self-center mt-6">
          <Button 
            onClick={onComplete}
            className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black"
          >
            Continue to Challenges
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonScreen;
