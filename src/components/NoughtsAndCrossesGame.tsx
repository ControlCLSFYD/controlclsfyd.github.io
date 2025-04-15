
import React, { useState, useEffect, useCallback } from 'react';
import { X, Circle } from 'lucide-react';
import { Button } from './ui/button';
import GameResult from './GameResult';

interface NoughtsAndCrossesGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
}

type Player = 'X' | 'O' | null;
type BoardState = (Player)[];

const NoughtsAndCrossesGame: React.FC<NoughtsAndCrossesGameProps> = ({ onGameComplete, onPlayAgain, difficulty = 1 }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false); // CPU starts first by default
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [showInstructions, setShowInstructions] = useState(true);
  const [cpuWins, setCpuWins] = useState<number>(0);
  const [playerFirstMove, setPlayerFirstMove] = useState<boolean>(false);
  
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setGameStatus('playing');
    setIsPlayerTurn(playerFirstMove); // Use playerFirstMove to determine who goes first
    
    // If it's CPU's turn, make its move after instructions disappear
    if (!playerFirstMove) {
      const timer = setTimeout(() => {
        const initialBoard = Array(9).fill(null);
        const computerMoveIndex = getBestMove(initialBoard, 'X');
        const newBoard = [...initialBoard];
        newBoard[computerMoveIndex] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(true);
      }, showInstructions ? 3000 : 500); // Shorter delay if instructions aren't showing
      
      return () => clearTimeout(timer);
    }
  }, [playerFirstMove, showInstructions]);
  
  useEffect(() => {
    setShowInstructions(true);
    
    const timer = setTimeout(() => {
      setShowInstructions(false);
      resetGame();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [difficulty, resetGame]);
  
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

  // Advanced minimax algorithm for optimal CPU moves
  const minimax = (board: BoardState, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    // Check terminal states
    if (checkWinner(board, 'X')) return 10 - depth;
    if (checkWinner(board, 'O')) return depth - 10;
    if (!board.includes(null)) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = 'X';
          const score = minimax(newBoard, depth + 1, false, alpha, beta);
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = 'O';
          const score = minimax(newBoard, depth + 1, true, alpha, beta);
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return bestScore;
    }
  };
  
  const getBestMove = (board: BoardState, player: Player): number => {
    // Always play perfectly regardless of difficulty
    let bestScore = -Infinity;
    let bestMove = 0;
    
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = player;
        const score = minimax(newBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
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
      const computerMoveIndex = getBestMove(newBoard, 'X');
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
    if (gameStatus === 'lost') {
      // If player lost, increment CPU win counter
      const newCpuWins = cpuWins + 1;
      setCpuWins(newCpuWins);
      
      // After 2 CPU wins, let player go first
      if (newCpuWins >= 2 && !playerFirstMove) {
        setPlayerFirstMove(true);
      }
    }
    
    onPlayAgain();
    resetGame();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full p-4">
      <h2 className="text-xl mb-4">NOUGHTS AND CROSSES CHALLENGE</h2>
      
      <div className="h-20 flex items-center justify-center mb-4">
        {showInstructions ? (
          <div className="flex items-center p-2 border border-terminal-green">
            <span>You play as O. {playerFirstMove ? 'You move first' : 'CPU moves first'}. Try to win if you can!</span>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-2">Win the game to continue</p>
            {cpuWins > 0 && (
              <p className="mb-2 text-yellow-400">CPU Wins: {cpuWins}</p>
            )}
            {difficulty > 1 && (
              <p className="mb-2 text-yellow-400">CPU Difficulty Level: Maximum</p>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-1 w-64 h-64 bg-black p-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
      </div>
      
      {gameStatus !== 'playing' && (
        <GameResult
          gameWon={gameStatus === 'won'}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={false}
        />
      )}
    </div>
  );
};

export default NoughtsAndCrossesGame;
