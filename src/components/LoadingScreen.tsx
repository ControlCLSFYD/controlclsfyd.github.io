import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import { getRandomPsalm } from '../utils/psalms';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { HelpCircle } from 'lucide-react';

interface LoadingScreenProps {
  onAccessGranted: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onAccessGranted }) => {
  const [loadingStep, setLoadingStep] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [randomPsalm, setRandomPsalm] = useState("");
  const [accessCodeCorrect, setAccessCodeCorrect] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showInvestiGator, setShowInvestiGator] = useState(false);
  
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
      setAccessCodeCorrect(true);
      setShowWarning(true);
    }
  };

  const handleContinue = () => {
    onAccessGranted();
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

      {loadingStep === 4 && !accessCodeCorrect && (
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
          
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
                  onClick={() => setShowInvestiGator(true)}
                >
                  <img 
                    src="/lovable-uploads/6b60af4c-2f10-44a6-a3ee-b75a67df103f.png" 
                    alt="Investi Gator" 
                    className="w-6 h-6 object-contain bg-black"
                  />
                  Investi Gator's Help
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border border-terminal-green p-4 text-terminal-green max-w-md">
                <div className="flex flex-col items-center">
                  <img 
                    src="/lovable-uploads/6b60af4c-2f10-44a6-a3ee-b75a67df103f.png" 
                    alt="Investi Gator" 
                    className="w-24 h-auto mb-4 object-contain bg-black"
                  />
                  <div className="text-terminal-green font-bold mb-2">
                    Investi Gator,
                  </div>
                  <div className="text-terminal-green font-bold mb-2">
                    The Investigative Alligator
                  </div>
                  <div className="bg-black border border-terminal-green p-3 rounded-lg">
                    <TypewriterText
                      text="Hi there! I'm Investi Gator, the Investigative Alligator. The access code you need is back on the homescreen. Just look more carefully!"
                      speed={30}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {randomPsalm && (
            <div className="mt-12 text-terminal-green opacity-70 max-w-lg whitespace-pre-line">
              "{randomPsalm}"
            </div>
          )}
        </div>
      )}

      {showWarning && (
        <div>
          <TypewriterText 
            text="NOTE: 

This game will include many unpleasant images and events. 

It is not suitable for children or the faint-hearted. 

The game is still under heavy development. Please excuse any time-outs or failures in the loading of images." 
            speed={10} // Increased typing speed for the warning
            className="mb-4 block whitespace-pre-line"
            onComplete={() => setTimeout(() => {
              const continueButton = document.getElementById('continue-button');
              if (continueButton) continueButton.style.opacity = '1';
            }, 500)}
          />
          <div className="mt-6">
            <Button 
              id="continue-button"
              onClick={handleContinue}
              className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black transition-opacity opacity-0"
            >
              CONTINUE TO GAME
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
