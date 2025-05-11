
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import { useToast } from "@/hooks/use-toast";
import { X } from 'lucide-react';

// Define Morse code mapping
const morseCodeMap: Record<string, string> = {
  'L': '.-..',
  'O': '---',
  'V': '...-',
  'E': '.'
};

// The phrase to encode
const targetPhrase = "LOVE";
const targetMorseCode = ".-.. --- ...- .";

interface MorseCodeGameProps extends BaseGameProps {}

const MorseCodeGame: React.FC<MorseCodeGameProps> = ({
  onGameComplete,
  onPlayAgain,
  difficulty = 1
}) => {
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: true, // Start the game immediately
    gameOver: false,
    gameWon: false,
    score: 0
  });
  
  const { toast } = useToast();
  const [displayedCode, setDisplayedCode] = useState<string>("");
  const [spacebarPressed, setSpacebarPressed] = useState<boolean>(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the container when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Handle key down event (spacebar pressed)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    if (e.code === 'Space' && !spacebarPressed) {
      e.preventDefault();
      setSpacebarPressed(true);
      setPressStartTime(Date.now());
      
      // Check for double tap
      if (lastTapTime && Date.now() - lastTapTime < 300) {
        // Double tap detected - add letter space
        const updatedCode = displayedCode + " ";
        setDisplayedCode(updatedCode);
        // Reset last tap time
        setLastTapTime(null);
        
        // Play a sound effect (optional)
        playSound('letter-space');
      } else {
        // Set last tap time
        setLastTapTime(Date.now());
      }
    }
    
    // Handle backspace to delete last character
    if (e.code === 'Backspace' && displayedCode.length > 0) {
      e.preventDefault();
      setDisplayedCode(prev => prev.slice(0, -1));
      playSound('delete');
    }
  };

  // Handle key up event (spacebar released)
  const handleKeyUp = (e: KeyboardEvent) => {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    if (e.code === 'Space' && spacebarPressed && pressStartTime) {
      e.preventDefault();
      const pressDuration = Date.now() - pressStartTime;
      
      // Determine if it's a dot or dash based on duration
      let symbol = '';
      if (pressDuration < 300) {
        // Short press - dot
        symbol = '.';
        playSound('dot');
      } else {
        // Long press - dash
        symbol = '-';
        playSound('dash');
      }
      
      const updatedCode = displayedCode + symbol;
      setDisplayedCode(updatedCode);
      
      // Reset states
      setSpacebarPressed(false);
      setPressStartTime(null);
      
      // Check if the code is correct
      checkMorseCode(updatedCode);
    }
  };

  // Play a sound effect based on the action
  const playSound = (type: 'dot' | 'dash' | 'letter-space' | 'success' | 'delete') => {
    // If we had Web Audio API implemented, we'd play sounds here
    console.log(`Playing sound: ${type}`);
  };

  const handleDeleteClick = () => {
    if (displayedCode.length > 0) {
      setDisplayedCode(prev => prev.slice(0, -1));
      playSound('delete');
    }
  };

  // Check if the entered morse code is correct
  const checkMorseCode = (code: string) => {
    // Remove excess spaces and normalize
    const normalizedInput = code.replace(/\s+/g, ' ').trim();
    const targetCode = targetMorseCode.replace(/\s+/g, ' ').trim();
    
    // Check if input matches target
    if (normalizedInput === targetCode) {
      setGameState({
        ...gameState,
        gameOver: true,
        gameWon: true
      });
      
      playSound('success');
      
      toast({
        title: "Message Received 💖",
        description: "Your Morse code message was transmitted successfully!",
      });
    }
  };

  // Set up event listeners
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, spacebarPressed, pressStartTime, displayedCode, lastTapTime]);

  // Handle continue after game is won
  const handleContinue = () => {
    onGameComplete();
  };

  // Handle play again button
  const handlePlayAgain = () => {
    onPlayAgain();
    setGameState({
      gameStarted: true,
      gameOver: false,
      gameWon: false,
      score: 0
    });
    setDisplayedCode("");
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[500px] p-4 relative"
      ref={containerRef}
      tabIndex={0} // Make div focusable to capture keyboard events
      style={{ outline: 'none' }} // Remove outline when focused
    >
      {gameState.gameOver ? (
        <GameResult 
          gameWon={gameState.gameWon} 
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={true}
        />
      ) : (
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg opacity-80">TRANSMIT MESSAGE:</h3>
            <p className="text-2xl font-bold">LOVE</p>
          </div>
          
          <div className="h-32 border border-terminal-green bg-terminal-black/30 rounded-md flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-2 left-2 text-xs opacity-70">MORSE TRANSMISSION</div>
            
            {displayedCode ? (
              <div className="flex items-center">
                <p className="text-3xl font-mono tracking-wider animate-pulse">
                  {displayedCode}
                  <span className="animate-blink ml-1">_</span>
                </p>
                <button 
                  onClick={handleDeleteClick}
                  className="ml-4 p-2 rounded-full hover:bg-terminal-black/40"
                  aria-label="Delete"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <p className="text-lg opacity-50">
                Press spacebar to begin...
                <span className="animate-blink ml-1">_</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="text-sm opacity-70 mb-2">
              <span className="mr-4">Short press = · (dot)</span>
              <span className="mr-4">Long press = – (dash)</span>
              <span>Press backspace to delete</span>
            </div>
            
            <div className={`w-32 h-10 border ${spacebarPressed ? 'bg-terminal-green text-black' : 'bg-transparent'} border-terminal-green rounded-md flex items-center justify-center transition-colors`}>
              SPACEBAR
            </div>
          </div>
        </div>
      )}
      
      {/* Visual feedback animation for spacebar presses */}
      {spacebarPressed && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-terminal-green rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  );
};

export default MorseCodeGame;
