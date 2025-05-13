import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import { useToast } from "@/hooks/use-toast";
import { X, Keyboard } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

// Define Morse code mapping
const morseCodeMap: Record<string, string> = {
  'L': '.-..',
  'O': '---',
  'V': '...-',
  'E': '.'
};

// The phrase to encode
const targetPhrase = "LOVE";
// Update this to match the exact requested code pattern
const targetMorseCode = ".-..---...-.";

interface MorseCodeGameProps extends BaseGameProps {}

const MorseCodeGame: React.FC<MorseCodeGameProps> = ({
  onGameComplete,
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
  const isMobile = useIsMobile();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Focus the container when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle key down event (spacebar pressed)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    if (e.code === 'Space' && !spacebarPressed) {
      e.preventDefault();
      setSpacebarPressed(true);
      setPressStartTime(Date.now());
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
    if (!audioContextRef.current) return;

    // Stop any existing sound
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    // Create new oscillator
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    // Set volume
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    
    // Start the oscillator
    oscillator.start();
    oscillatorRef.current = oscillator;

    // Stop the sound after appropriate duration
    const duration = type === 'dot' ? 0.1 : type === 'dash' ? 0.3 : 0.2;
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const handleDeleteClick = () => {
    if (displayedCode.length > 0) {
      setDisplayedCode(prev => prev.slice(0, -1));
      playSound('delete');
    }
  };

  // Mobile space button handlers
  const handleSpaceButtonDown = () => {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    setSpacebarPressed(true);
    setPressStartTime(Date.now());
  };

  const handleSpaceButtonUp = () => {
    if (!gameState.gameStarted || gameState.gameOver || !pressStartTime) return;
    
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
  };

  const handleBackspaceClick = () => {
    if (displayedCode.length > 0) {
      setDisplayedCode(prev => prev.slice(0, -1));
      playSound('delete');
    }
  };

  // Check if the entered morse code is correct
  const checkMorseCode = (code: string) => {
    // Remove ALL spaces and normalize input for comparison
    const normalizedInput = code.replace(/\s+/g, '').trim();
    const targetCode = targetMorseCode.replace(/\s+/g, '');
    
    console.log('Checking code:', normalizedInput);
    console.log('Target code:', targetCode);
    
    // Check if the normalized input contains the target code sequence
    if (normalizedInput === targetCode) {
      console.log('Morse code match successful!');
      setGameState({
        ...gameState,
        gameOver: true,
        gameWon: true
      });
      
      playSound('success');
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
  }, [gameState, spacebarPressed, pressStartTime, displayedCode]);

  // Handle continue after game is won
  const handleContinue = () => {
    onGameComplete();
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
          alwaysShowContinue={true}
        />
      ) : (
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg opacity-80">TRANSMIT MESSAGE:</h3>
            <p className="text-2xl font-bold">LOVE</p>
          </div>
          
          <div className="h-32 border border-terminal-green bg-terminal-black/30 rounded-md flex items-center justify-center overflow-hidden relative">
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
              <span className="mr-4">Short spacebar press = · (dot)</span>
              <span className="mr-4">Long spacebar press = - (dash)</span>
              <span>Press backspace to delete</span>
            </div>
            
            {/* Mobile controls */}
            {isMobile && (
              <div className="w-full flex flex-col gap-3 mt-4">
                <Button
                  variant="outline"
                  className="h-16 text-lg border border-terminal-green flex items-center justify-center bg-terminal-black/20"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleSpaceButtonDown();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSpaceButtonUp();
                  }}
                >
                  <Keyboard className="mr-2" size={24} />
                  SPACEBAR
                </Button>
                
                <Button
                  variant="outline"
                  className="h-12 text-lg border border-terminal-green flex items-center justify-center bg-terminal-black/20"
                  onClick={handleBackspaceClick}
                >
                  <X className="mr-2" size={24} />
                  DELETE
                </Button>
              </div>
            )}
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
