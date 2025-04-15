
import React, { useState, useEffect } from 'react';
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
  const [typingComplete, setTypingComplete] = useState(false);

  // Reset typing state when lesson changes
  useEffect(() => {
    setTypingComplete(false);
  }, [lesson.id]);

  const handleTypingComplete = () => {
    setTypingComplete(true);
  };

  return (
    <div className="flex flex-col items-start p-4 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl text-terminal-green mb-4">
          <TypewriterText
            text={`LESSON ${lesson.id}: ${lesson.title.toUpperCase()}`}
            speed={30}
          />
        </h2>
        
        <div className="space-y-4 text-left">
          {lesson.content.map((paragraph, index) => (
            <div key={index} className="mb-4">
              <TypewriterText
                text={paragraph}
                speed={20}
                onComplete={index === lesson.content.length - 1 ? handleTypingComplete : undefined}
              />
            </div>
          ))}
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
