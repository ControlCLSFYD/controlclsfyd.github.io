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
import IntroVideo from './IntroVideo';

interface LoadingScreenProps {
  onAccessGranted: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onAccessGranted }) => {
  const [loadingStep, setLoadingStep] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [randomPsalm, setRandomPsalm] = useState("");
  const [accessCodeCorrect, setAccessCodeCorrect] = useState(false);
  const [showWarningShort, setShowWarningShort] = useState(false);
  const [showWarningNDA, setShowWarningNDA] = useState(false);
  const [showInvestiGator, setShowInvestiGator] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    if (!showIntro) {
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
    }
  }, [showIntro]);
  
  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "111") {
      setAccessCodeCorrect(true);
      setShowWarningNDA(true);
    } else if (accessCode === "223") {
      setAccessCodeCorrect(true);
      setShowWarningShort(true);
      localStorage.setItem('direct-to-court', 'true');
    }
  };

  const handleContinue = () => {
    onAccessGranted();
  };

  const handleNDAComplete = () => {
    setShowWarningNDA(false);
    setShowWarningShort(true);
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
  };
  
  if (showIntro) {
    return <IntroVideo onVideoEnd={handleIntroEnd} />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
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
        <div className="text-center">
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
                    src="/lovable-uploads/f4308e48-123d-4416-9df6-ac0dc4b0342c.png" 
                    alt="Investi Gator" 
                    className="w-6 h-6 object-contain bg-black"
                  />
                  Investi Gator's Help
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border border-terminal-green p-4 text-terminal-green max-w-md">
                <div className="flex flex-col items-center">
                  <img 
                    src="/lovable-uploads/1c3efc59-880b-420b-91a1-5e38b4e4abb1.png" 
                    alt="Investi Gator" 
                    className="w-24 h-auto mb-4 object-contain bg-black"
                  />
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
        </div>
      )}

      {showWarningNDA && (
        <div className="text-center max-w-lg">
          <TypewriterText 
            text={`This Non-Disclosure Agreement (the "Agreement") is entered into as a condition of access to materials, communications, and/or actions ("Confidential Information") disclosed or encountered as part of Operation Rose, CLSFYD: The Game, or any related initiative operated under the CLSFYD brand (hereinafter, "CLSFYD").
By participating in CLSFYD activities, engaging with digital content, receiving any physical items (each, an "Artifact"), or communicating with agents of CLSFYD ("Agents"), the undersigned individual (the "Participant") agrees to be legally bound by the terms of this Agreement.

Confidentiality Obligations
The Participant acknowledges and agrees that:
All knowledge directly related to Operation Rose as encountered during or related to CLSFYD (collectively, "Confidential Information") is strictly confidential.
The Participant shall not disclose, share, replicate, publish, hint at, or otherwise communicate any part of the Confidential Information to any person or entity, unless expressly authorized in writing by CONTROL (defined below).
This obligation of secrecy extends to all forms of communication: spoken, written, digital, visual, symbolic, or otherwise conceptual.

Scope of Confidentiality
This Agreement covers all CLSFYD-related information, including but not limited to:
Digital game access credentials or CLSFYD codes.
The nature of and characteristics of Operation Rose and its sub-operations.
Particulars of interactions with CLSFYD Agents, CONTROL, or any autonomous system within CLSFYD.

Authority of CONTROL
The Participant understands and accepts that:
All decisions, instructions, and permissions regarding Confidential Information are issued solely by "CONTROL", the overseeing intelligence of CLSFYD.
CONTROL may choose to contact or ignore the Participant at its discretion. CONTROL's silence is to be respected as intentional.
CONTROL's instructions, whether explicit or implied, override personal discretion in matters of disclosure or action.

Enforcement and Consequences
Breach of this Agreement, in whole or in part, will result in expulsion from CLSFYD without notice, permanent blacklisting, psychological countermeasures, or other consequences deemed necessary by CONTROL.
CLSFYD reserves the right to pursue legal remedies, equitable relief, and any other protective actions available under applicable international and interdimensional law.

Duration
This Agreement remains in effect indefinitely unless otherwise terminated in writing by CONTROL.
Termination of participation does not release the Participant from their obligations of secrecy.

Final Acknowledgements
By clicking 'Continue to Game' below, the Participant affirms that:
They are willingly entering a high-trust, high-risk informational ecosystem.
They understand the real-world and symbolic implications of their silence.
They will not break confidentiality even under personal, emotional, or existential duress.
They serve something greater than themselves.

IMPORTANT NOTICE – READ
This document grants you permission to discuss and engage publicly with CLSFYD: The Game and its narrative elements.
However, you are strictly prohibited from discussing, referencing, or revealing any information related to "Operation Rose". Revelation of Operation Rose is under the strict purview of CONTROL's collection, analysis, and publication. Violation of this distinction is considered a breach of confidentiality.

SIGNATURE:
I, the undersigned, do hereby agree to the above terms and bind myself in secrecy by clicking the below:`}
            speed={6}
            className="mb-4 block whitespace-pre-line"
            onComplete={() => setTimeout(() => {
              const continueButton = document.getElementById('nda-continue-button');
              if (continueButton) continueButton.style.opacity = '1';
            }, 500)}
          />
          <div className="mt-6">
            <Button 
              id="nda-continue-button"
              onClick={handleNDAComplete}
              className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black transition-opacity opacity-0"
            >
              CONTINUE
            </Button>
          </div>
        </div>
      )}

      {showWarningShort && (
        <div className="text-center max-w-lg">
          <TypewriterText 
            text={`NOTE:

This game will include many unpleasant images and events.

It is not suitable for children or the faint-hearted.

The game is still under heavy development. Please excuse any time-outs or failures in the loading of images.`} 
            speed={30}
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