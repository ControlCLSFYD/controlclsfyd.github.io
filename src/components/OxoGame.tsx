import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react';
import { Button } from './ui/button';
import GameResult from './GameResult';

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

  useEffect(() => {
    const setupNearWinBoard = (): BoardState => {
      const patterns: BoardState[] = [
        [null, 'O', 'O', 'X', null, null, 'X', null, 'X'],
        ['O', 'O', null, null, 'X', null, 'X', null, 'X'],
        ['O', 'X', 'X', 'O', null, null, null, null, 'X'],
        ['X', 'O', 'X', null, 'O', null, null, null, 'X'],
        ['O', 'X', null, 'X', 'O', null, null, null, 'X'],
        ['X', null, 'O', null, 'O', 'X', null, 'X', null]
      ];
      
      if (difficulty > 3) {
        return Array(9).fill(null);
      } else if (difficulty > 1) {
        return patterns[Math.floor(Math.random() * 3) + 3];
      }
      
      return patterns[Math.floor(Math.random() * patterns.length)];
    };
    
    setBoard(setupNearWinBoard());
    setGameStatus('playing');
    setIsPlayerTurn(true);
    
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [difficulty]);
  
  const checkWinner = (board: BoardState, player: Player): boolean => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];
    
    return winPatterns.some(pattern =>
      pattern.every(index => board[index] === player)
    );
  };
  
  const getComputerMove = (board: BoardState): number => {
    const smartnessChance = Math.min(0.4 + (difficulty * 0.12), 0.95);
    
    if (Math.random() > smartnessChance) {
      const emptyCells = board.reduce((acc, cell, index) => 
        !cell ? [...acc, index] : acc, [] as number[]);
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'X';
        if (checkWinner(newBoard, 'X')) return i;
      }
    }
    
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        if (checkWinner(newBoard, 'O')) return i;
      }
    }
    
    if (!board[4]) return 4;
    
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => !board[corner]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    const emptyCells = board.reduce((acc, cell, index) => 
      !cell ? [...acc, index] : acc, [] as number[]);
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };
  
  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;
    
    const newBoard = [...board];
    newBoard[index] = 'O';
    setBoard(newBoard);
    
    if (checkWinner(newBoard, 'O')) {
      setGameStatus('won');
      return;
    }
    
    if (!newBoard.includes(null)) {
      setGameStatus('draw');
      return;
    }
    
    setIsPlayerTurn(false);
    setTimeout(() => {
      const computerMoveIndex = getComputerMove(newBoard);
      const finalBoard = [...newBoard];
      finalBoard[computerMoveIndex] = 'X';
      setBoard(finalBoard);
      
      if (checkWinner(finalBoard, 'X')) {
        setGameStatus('lost');
      } else if (!finalBoard.includes(null)) {
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
      {difficulty > 1 && (
        <p className="mb-2 text-yellow-400">CPU Difficulty Level: {difficulty}</p>
      )}
      
      {showInstructions && (
        <div className="flex items-center mb-4 p-2 border border-terminal-green">
          <span>You play as O. Click an empty cell to make your move.</span>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-1 w-64 h-64 border border-terminal-green p-2 bg-black">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
      </div>
      
      {gameStatus !== 'playing' && (
        <GameResult
          gameWon={gameStatus === 'won'}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default OxoGame;
