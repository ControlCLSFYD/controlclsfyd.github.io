
import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import { getRandomPsalm } from '../utils/psalms';

interface LoadingScreenProps {
  onAccessGranted: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onAccessGranted }) => {
  const [loadingStep, setLoadingStep] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [randomPsalm, setRandomPsalm] = useState("");
  
  useEffect(() => {
    const dotTimeout = setTimeout(() => {
      setLoadingStep(2); // Show loading dots
    }, 1000);

    const initTimeout = setTimeout(() => {
      setLoadingStep(3); // Show initializing text
    }, 2500);

    const codeTimeout = setTimeout(() => {
      setLoadingStep(4); // Show access code prompt
      setRandomPsalm(getRandomPsalm()); // Set a random psalm when showing access code
    }, 5000);

    return () => {
      clearTimeout(dotTimeout);
      clearTimeout(initTimeout);
      clearTimeout(codeTimeout);
    };
  }, []);
  
  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "111") {
      onAccessGranted();
    }
  };
  
  return (
    <div className="flex flex-col items-start">
      {loadingStep === 2 && (
        <div className="mb-8">
          <TypewriterText 
            text="..." 
            speed={200} 
            onComplete={() => setTimeout(() => setLoadingStep(3), 500)}
          />
        </div>
      )}

      {loadingStep === 3 && (
        <div className="mb-8">
          <TypewriterText 
            text="CLSFYD Challenge Initializing..." 
            onComplete={() => setTimeout(() => setLoadingStep(4), 1000)}
          />
        </div>
      )}

      {loadingStep === 4 && (
        <div>
          <TypewriterText text="Enter your access code." className="mb-4 block" />
          <form onSubmit={handleAccessCodeSubmit} className="mt-4">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="bg-transparent border border-terminal-green text-terminal-green p-1 focus:outline-none"
              autoFocus
            />
            <button 
              type="submit" 
              className="border border-terminal-green text-terminal-green px-2 py-1 ml-2 focus:outline-none hover:bg-terminal-green hover:bg-opacity-20"
            >
              Submit
            </button>
          </form>
          
          {randomPsalm && (
            <div className="mt-12 text-terminal-green opacity-70 max-w-lg whitespace-pre-line">
              "{randomPsalm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
