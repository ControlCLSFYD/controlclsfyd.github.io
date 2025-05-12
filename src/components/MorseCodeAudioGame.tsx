
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import { useToast } from "@/hooks/use-toast";
import { Play } from 'lucide-react';

interface MorseCodeAudioGameProps extends BaseGameProps {}

const MorseCodeAudioGame: React.FC<MorseCodeAudioGameProps> = ({
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
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [playsRemaining, setPlaysRemaining] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const correctAnswer = "I love you";

  // Function to simulate playing the morse code audio
  const playMorseCodeAudio = () => {
    if (playsRemaining <= 0) return;
    
    setIsPlaying(true);
    
    // Here you would normally play the audio file
    // For now, we'll just simulate it
    console.log("Playing morse code for 'I love you'");
    
    // Simulate audio playback time (5 seconds)
    setTimeout(() => {
      setIsPlaying(false);
      setPlaysRemaining(prev => prev - 1);
      
      toast({
        title: "Audio played",
        description: `${playsRemaining - 1} plays remaining.`,
      });
    }, 5000);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    // Check if the answer is correct (case-insensitive)
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setGameState({
        ...gameState,
        gameOver: true,
        gameWon: true,
        score: 1
      });
      
      toast({
        title: "Correct!",
        description: "You've successfully decoded the Morse message!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "That's not what the message says. Try again.",
        variant: "destructive"
      });
    }
  };

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
    setUserAnswer("");
    setPlaysRemaining(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
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
            <h3 className="text-2xl font-bold mb-4">LISTENING</h3>
            <p className="text-lg mb-6">
              Listen to the Morse code message and type what you hear.
              You can play the message {playsRemaining} more times.
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
            
            {/* Updated submit button to have green border with black interior */}
            <button
              onClick={handleSubmitAnswer}
              disabled={userAnswer.trim() === ''}
              className="mt-4 w-full border border-terminal-green bg-terminal-black hover:bg-terminal-black/70 text-terminal-green py-2 px-4 rounded-md transition-colors"
            >
              Submit Answer
            </button>
            
            <div className="mt-4 text-sm opacity-70">
              <p>Note: Your answer must match exactly. Check your spelling and punctuation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MorseCodeAudioGame;
