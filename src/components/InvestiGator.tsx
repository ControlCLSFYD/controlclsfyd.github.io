
import React from 'react';
import { LessonContent } from './LessonScreen';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

interface InvestiGatorProps {
  lesson: LessonContent;
  onClose: () => void;
}

const InvestiGator: React.FC<InvestiGatorProps> = ({ lesson, onClose }) => {
  return (
    <div className="flex flex-col items-start p-4 max-w-3xl mx-auto">
      <div className="mb-6 w-full">
        <div className="flex items-start">
          <div className="w-1/3 text-center">
            <div className="text-6xl mb-2">🐊</div>
            <div className="text-terminal-green font-bold">INVESTI GATOR</div>
          </div>
          <div className="w-2/3 bg-black border border-terminal-green p-4 rounded-lg relative">
            {/* Speech bubble pointer */}
            <div className="absolute w-4 h-4 bg-black border-l border-b border-terminal-green transform rotate-45 left-[-8px] top-6"></div>
            
            <h2 className="text-xl text-terminal-green mb-4">
              <TypewriterText
                text={`LESSON ${lesson.id}: ${lesson.title.toUpperCase()}`}
                speed={10}
              />
            </h2>
            
            <div className="space-y-4 text-left text-terminal-green">
              <p className="italic">
                "Hi there CLSFYD Adventurer! I'm Investi Gator, the Investigative Alligator..."
              </p>
              
              {lesson.content.map((paragraph, index) => (
                <p key={index} className="mb-2">"{paragraph}"</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="self-center mt-6">
        <Button 
          onClick={onClose}
          className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black"
        >
          RETURN TO QUESTION
        </Button>
      </div>
    </div>
  );
};

export default InvestiGator;
