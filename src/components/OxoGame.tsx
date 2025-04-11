
import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react';

interface OxoGameProps {
  onGameComplete: () => void;
}

type Player = 'X' | 'O' | null;
type BoardState = (Player)[];

const OxoGame: React.FC<OxoGameProps> = ({ onGameComplete }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [showInstructions, setShowInstructions] = useState(true);

  // Setup a game that's one move away from the player winning
  useEffect(() => {
    // Create a board where player (O) is one move away from winning
    const setupNearWinBoard = (): BoardState => {
      // Random setup pattern selection
      const patterns = [
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
      
      return patterns[Math.floor(Math.random() * patterns.length)];
    };
    
    setBoard(setupNearWinBoard());
    
    // Hide instructions after 3 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
      setTimeout(() => onGameComplete(), 1000);
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
        className="flex items-center justify-center w-20 h-20 border-2 border-terminal-green cursor-pointer"
        onClick={() => handleCellClick(index)}
      >
        {cellValue === 'O' && <Circle className="text-terminal-green" size={40} />}
        {cellValue === 'X' && <X className="text-terminal-green" size={40} />}
      </div>
    );
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
      
      {gameStatus === 'won' && (
        <p className="mt-4 text-terminal-green">You won! Proceeding to next challenge...</p>
      )}
      {gameStatus === 'lost' && (
        <p className="mt-4 text-terminal-green">You lost. Try again!</p>
      )}
      {gameStatus === 'draw' && (
        <p className="mt-4 text-terminal-green">Draw! Try again!</p>
      )}
    </div>
  );
};

export default OxoGame;
