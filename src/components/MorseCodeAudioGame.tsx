import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import { useToast } from "@/hooks/use-toast";
import { Play } from 'lucide-react';

interface MorseCodeAudioGameProps extends BaseGameProps {}

const MorseCodeAudioGame: React.FC<MorseCodeAudioGameProps> = ({
  onGameComplete,
  difficulty = 1
}) => {
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: true,
    gameOver: false,
    gameWon: false,
    score: 0
  });
  
  const { toast } = useToast();
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [playsRemaining, setPlaysRemaining] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const correctAnswer = "I love you";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/audio/morse/morse_love.wav');
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to play the morse code audio
  const playMorseCodeAudio = () => {
    if (playsRemaining <= 0 || !audioRef.current) return;
    
    setIsPlaying(true);
    
    // Play the audio file
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive"
      });
    });
    
    // Update state when audio finishes playing
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setPlaysRemaining(prev => prev - 1);
    };
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    setUserAnswer(newAnswer);
    
    // Check if the answer is correct (case-insensitive)
    if (newAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setGameState({
        ...gameState,
        gameOver: true,
        gameWon: true,
        score: 1
      });
    }
  };

  // Handle continue after game is won
  const handleContinue = () => {
    onGameComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
      {gameState.gameOver ? (
        <GameResult 
          gameWon={gameState.gameWon} 
          onContinue={handleContinue}
          alwaysShowContinue={true}
        />
      ) : (
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold mb-4">LISTENING</h3>
            <p className="text-lg mb-6">
              Listen to the Morse code message and type what you hear.
              Attempts remaining: {playsRemaining}
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Updated play button to be a square with green triangle */}
            <button
              onClick={playMorseCodeAudio}
              disabled={playsRemaining <= 0 || isPlaying}
              className="h-16 w-16 bg-terminal-black border border-terminal-green flex items-center justify-center mx-auto"
              aria-label="Play Morse Code"
            >
              <Play size={32} className="text-terminal-green" />
            </button>
            
            {isPlaying && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-terminal-green rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-ping animation-delay-200"></div>
                <div className="w-1 h-1 bg-terminal-green rounded-full animate-ping animation-delay-400"></div>
              </div>
            )}
            
            <div className="mt-8">
              <label htmlFor="morse-answer" className="block text-left mb-2">
                What does the message say?
              </label>
              <input
                id="morse-answer"
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-terminal-green bg-terminal-black/30 rounded-md focus:ring-1 focus:ring-terminal-green"
              />
            </div>
            
            <div className="mt-4 text-sm opacity-70">
              <p>Note: Pen and paper recommended.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MorseCodeAudioGame;
