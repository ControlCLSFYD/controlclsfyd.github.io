import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react';
import { Button } from './ui/button';

interface OxoGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
}

type Player = 'X' | 'O' | null;
type BoardState = (Player)[];

const OxoGame: React.FC<OxoGameProps> = ({ onGameComplete, onPlayAgain, difficulty = 1 }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [showInstructions, setShowInstructions] = useState(true);

  // Setup a game that's one move away from the player winning
  useEffect(() => {
    // Create a board where player (O) is one move away from winning
    const setupNearWinBoard = (): BoardState => {
      // Random setup pattern selection
      const patterns: BoardState[] = [
        // Horizontal win setups
        [null, 'O', 'O', 'X', null, null, 'X', null, 'X'],
        ['O', 'O', null, null, 'X', null, 'X', null, 'X'],
        // Vertical win setups
        ['O', 'X', 'X', 'O', null, null, null, null, 'X'],
        ['X', 'O', 'X', null, 'O', null, null, null, 'X'],
        // Diagonal win setups
        ['O', 'X', null, 'X', 'O', null, null, null, 'X'],
        ['X', null, 'O', null, 'O', 'X', null, 'X', null]
      ];
      
      // Higher difficulty means fewer easy setups - make the game harder
      if (difficulty > 3) {
        return Array(9).fill(null); // Start with empty board at higher difficulties
      } else if (difficulty > 1) {
        // For medium difficulty, use more challenging setups
        return patterns[Math.floor(Math.random() * 3) + 3]; // Use the more challenging patterns
      }
      
      return patterns[Math.floor(Math.random() * patterns.length)];
    };
    
    setBoard(setupNearWinBoard());
    setGameStatus('playing');
    setIsPlayerTurn(true);
    
    // Hide instructions after 3 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [difficulty]);
  
  // Check for win conditions
  const checkWinner = (board: BoardState, player: Player): boolean => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    return winPatterns.some(pattern =>
      pattern.every(index => board[index] === player)
    );
  };
  
  // Find best move for computer (X)
  const getComputerMove = (board: BoardState): number => {
    const smartnessChance = Math.min(0.4 + (difficulty * 0.12), 0.95); // increases from 0.52 to 0.95 based on difficulty
    
    // Sometimes make random moves based on difficulty level
    if (Math.random() > smartnessChance) {
      const emptyCells = board.reduce((acc, cell, index) => 
        !cell ? [...acc, index] : acc, [] as number[]);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    // Check if computer can win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'X';
        if (checkWinner(newBoard, 'X')) return i;
      }
    }
    
    // Check if player is about to win and block
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        if (checkWinner(newBoard, 'O')) return i;
      }
    }
    
    // Choose center if available
    if (!board[4]) return 4;
    
    // Choose a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => !board[corner]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Choose a random empty cell
    const emptyCells = board.reduce((acc, cell, index) => 
      !cell ? [...acc, index] : acc, [] as number[]);
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };
  
  // Handle player's move
  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;
    
    const newBoard = [...board];
    newBoard[index] = 'O';
    setBoard(newBoard);
    
    // Check if player won
    if (checkWinner(newBoard, 'O')) {
      setGameStatus('won');
      return;
    }
    
    // Check for draw
    if (!newBoard.includes(null)) {
      setGameStatus('draw');
      return;
    }
    
    // Computer's turn
    setIsPlayerTurn(false);
    setTimeout(() => {
      const computerMoveIndex = getComputerMove(newBoard);
      const finalBoard = [...newBoard];
      finalBoard[computerMoveIndex] = 'X';
      setBoard(finalBoard);
      
      // Check if computer won
      if (checkWinner(finalBoard, 'X')) {
        setGameStatus('lost');
      } else if (!finalBoard.includes(null)) {
        // Check for draw
        setGameStatus('draw');
      } else {
        setIsPlayerTurn(true);
      }
    }, 500);
  };
  
  const renderCell = (index: number) => {
    const cellValue = board[index];
    
    return (
      <div 
        key={index}
        className="flex items-center justify-center w-20 h-20 border-2 border-terminal-green cursor-pointer"
        onClick={() => handleCellClick(index)}
      >
        {cellValue === 'O' && <Circle className="text-terminal-green" size={40} />}
        {cellValue === 'X' && <X className="text-terminal-green" size={40} />}
      </div>
    );
  };
  
  const handleContinue = () => {
    onGameComplete();
  };
  
  const handlePlayAgain = () => {
    onPlayAgain();
  };
  
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl mb-4">OXO CHALLENGE</h2>
      <p className="mb-2">Win the game to continue</p>
      
      {showInstructions && (
        <div className="flex items-center mb-4 p-2 border border-terminal-green">
          <span>You play as O. Click an empty cell to make your move.</span>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-1 w-64 h-64 border border-terminal-green p-2 bg-black">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
      </div>
      
      {gameStatus !== 'playing' && (
        <div className="mt-6 flex flex-col items-center">
          {gameStatus === 'won' && (
            <div className="text-terminal-green mb-4">You won!</div>
          )}
          {gameStatus === 'lost' && (
            <div className="text-terminal-green mb-4">You lost!</div>
          )}
          {gameStatus === 'draw' && (
            <div className="text-terminal-green mb-4">It's a draw!</div>
          )}
          
          <div className="flex gap-4">
            {gameStatus === 'won' && (
              <Button 
                variant="outline" 
                onClick={handleContinue}
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black"
              >
                Continue
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handlePlayAgain}
              className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OxoGame;
