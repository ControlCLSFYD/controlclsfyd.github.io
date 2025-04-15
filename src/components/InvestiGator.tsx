import React, { useState, useEffect } from 'react';
import { LessonContent } from './LessonScreen';
import TypewriterText from './TypewriterText';
import { Button } from './ui/button';

interface InvestiGatorProps {
  lesson: LessonContent;
  onClose: () => void;
}

const InvestiGator: React.FC<InvestiGatorProps> = ({ lesson, onClose }) => {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);
  const [showingIntro, setShowingIntro] = useState<boolean>(true);
  const [currentContentIndex, setCurrentContentIndex] = useState<number>(-1);
  const [typingComplete, setTypingComplete] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenIntroLS = localStorage.getItem('hasSeenInvestiGatorIntro');
    if (hasSeenIntroLS === 'true') {
      setHasSeenIntro(true);
      setShowingIntro(false);
      setCurrentContentIndex(0);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenInvestiGatorIntro', 'true');
    setHasSeenIntro(true);
    setShowingIntro(false);
    setCurrentContentIndex(0);
  };

  const handleParagraphComplete = () => {
    if (showingIntro) {
      handleIntroComplete();
    } else if (currentContentIndex < lesson.content.length - 1) {
      setCurrentContentIndex(prev => prev + 1);
    } else {
      setTypingComplete(true);
    }
  };

  return (
    <div className="flex flex-col items-start p-2 md:p-4 max-w-3xl mx-auto">
      <div className="mb-6 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/b721b90f-fd57-4feb-aecd-e7a1f7f2ab94.png" 
              alt="Investi Gator" 
              className="w-32 h-auto mx-auto md:w-full max-w-[200px] object-contain bg-black"
            />
            <div className="text-terminal-green font-bold mt-2">
              INVESTI GATOR
            </div>
            <div className="text-terminal-green font-bold">
              the Investigative Alligator
            </div>
            
            {/* Bio information */}
            <div className="text-terminal-green text-sm mt-3 text-left mx-auto max-w-[180px]">
              <div><span className="font-bold">First Name:</span> Investi</div>
              <div><span className="font-bold">Surname:</span> Gator</div>
              <div><span className="font-bold">Profession:</span> Investigator</div>
              <div><span className="font-bold">Creature:</span> Alligator</div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 bg-black border border-terminal-green p-3 md:p-4 rounded-lg relative min-h-[200px]">
            <div className="hidden md:block absolute w-4 h-4 bg-black border-l border-b border-terminal-green transform rotate-45 left-[-8px] top-6"></div>
            
            <h2 className="text-xl text-terminal-green mb-4">
              <TypewriterText
                text={`LESSON ${lesson.id}: ${lesson.title.toUpperCase()}`}
                speed={10}
              />
            </h2>
            
            <div className="space-y-4 text-left text-terminal-green">
              {!hasSeenIntro && showingIntro && (
                <div className="mb-2">
                  <TypewriterText
                    text="Hi there CLSFYD Adventurer! I'm Investi Gator, the Investigative Alligator..."
                    speed={15}
                    onComplete={handleParagraphComplete}
                  />
                </div>
              )}
              
              {!showingIntro && (
                <div className="mb-2">
                  {lesson.content.map((paragraph, index) => (
                    <div key={index} style={{ display: index <= currentContentIndex ? 'block' : 'none' }} className="mb-4">
                      {index === currentContentIndex ? (
                        <TypewriterText
                          text={paragraph}
                          speed={15}
                          onComplete={handleParagraphComplete}
                        />
                      ) : (
                        <span>{paragraph}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="self-center mt-4">
        {(typingComplete || hasSeenIntro) && (
          <Button 
            onClick={onClose}
            className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black"
          >
            RETURN TO QUESTION
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvestiGator;
