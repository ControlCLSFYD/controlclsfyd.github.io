
import React from 'react';

interface InvestiGatorProps {
  message: string;
  isIntroduction?: boolean;
}

const InvestiGator: React.FC<InvestiGatorProps> = ({ message, isIntroduction = false }) => {
  const introMessage = "Hi there CLSFYD Adventurer! I'm Investi Gator, the Investigative Alligator...";
  
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="min-w-[150px] flex-shrink-0">
        <img 
          src="/lovable-uploads/b09a2080-a0e3-420c-b647-b351a750e461.png" 
          alt="Investi Gator" 
          className="w-32 h-auto"
        />
      </div>
      <div className="relative bg-black border border-terminal-green p-4 rounded-lg flex-1">
        {/* Speech bubble triangle */}
        <div className="absolute left-[-10px] top-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-terminal-green border-b-[8px] border-b-transparent"></div>
        <div className="text-terminal-green">
          {isIntroduction ? (
            <>
              <p className="mb-4">{introMessage}</p>
              <p>{message}</p>
            </>
          ) : (
            <p>"{message}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestiGator;
