
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";

// Define Morse code mapping
const morseCodeMap: Record<string, string> = {
  'I': '..',
  ' ': '/',
  'L': '.-..',
  'O': '---',
  'V': '...-',
  'E': '.',
  'Y': '-.--',
  'U': '..-'
};

// The phrase to encode
const targetPhrase = "I LOVE YOU";
const targetMorseCode = ".. / .-.. --- ...- . / -.-- --- ...-";

interface MorseCodeGameProps extends BaseGameProps {}

const MorseCodeGame: React.FC<MorseCodeGameProps> = ({
  onGameComplete,
  onPlayAgain,
  difficulty = 1
}) => {
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    gameOver: false,
    gameWon: false,
    score: 0
  });
  
  const { toast } = useToast();
  const [currentInput, setCurrentInput] = useState<string>("");
  const [displayedCode, setDisplayedCode] = useState<string>("");
  const [spacebarPressed, setSpacebarPressed] = useState<boolean>(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate expected morse code from the target phrase
  const getExpectedMorseCode = () => {
    return targetPhrase.split('').map(char => morseCodeMap[char] || '').join(' ');
  };

  // Start the game
  const handleStartGame = () => {
    setGameState({ ...gameState, gameStarted: true });
    setShowInstructions(false);
    setCurrentInput("");
    setDisplayedCode("");
    // Focus the container to capture keyboard events
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    toast({
      title: "Morse Code Transmission Started",
      description: "Type 'I LOVE YOU' in Morse code using your spacebar",
    });
  };

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
        const updatedCode = displayedCode + " / ";
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
  const playSound = (type: 'dot' | 'dash' | 'letter-space' | 'success') => {
    // If we had Web Audio API implemented, we'd play sounds here
    console.log(`Playing sound: ${type}`);
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
      gameStarted: false,
      gameOver: false,
      gameWon: false,
      score: 0
    });
    setCurrentInput("");
    setDisplayedCode("");
    setShowInstructions(true);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[500px] p-4 relative"
      ref={containerRef}
      tabIndex={0} // Make div focusable to capture keyboard events
      onFocus={() => console.log("Container focused")}
      style={{ outline: 'none' }} // Remove outline when focused
    >
      {showInstructions ? (
        <div className="max-w-md text-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-mono mb-4 animate-pulse">CLASSIFIED TRANSMISSION</h2>
          
          <div className="bg-terminal-black/30 border border-terminal-green p-6 rounded-md">
            <h3 className="text-xl mb-4">Instructions:</h3>
            <ul className="text-left space-y-2 mb-6">
              <li>• Tap <span className="font-bold">SPACEBAR</span> once briefly → dot (·)</li>
              <li>• Hold <span className="font-bold">SPACEBAR</span> for longer → dash (–)</li>
              <li>• Double-tap <span className="font-bold">SPACEBAR</span> → letter space (/)</li>
            </ul>
            
            <div className="py-3 px-4 border border-terminal-green rounded-md mb-4">
              <p className="text-xs mb-1">YOUR MESSAGE:</p>
              <p className="text-lg font-bold">I LOVE YOU</p>
              <p className="text-xs mt-2">IN MORSE CODE:</p>
              <p className="text-sm font-mono mt-1">.. / .-.. --- ...- . / -.-- --- ..-</p>
            </div>
            
            <Button onClick={handleStartGame} className="mt-4 w-full bg-terminal-darkGreen hover:bg-terminal-green hover:text-black transition-all duration-300">
              Begin Transmission
            </Button>
          </div>
        </div>
      ) : gameState.gameOver ? (
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
            <p className="text-2xl font-bold">I LOVE YOU</p>
          </div>
          
          <div className="h-32 border border-terminal-green bg-terminal-black/30 rounded-md flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-2 left-2 text-xs opacity-70">MORSE TRANSMISSION</div>
            
            {displayedCode ? (
              <p className="text-3xl font-mono tracking-wider animate-pulse">
                {displayedCode}
                <span className="animate-blink ml-1">_</span>
              </p>
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
              <span>Double tap = / (space)</span>
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
