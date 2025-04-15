
import { useState, useEffect, useCallback } from 'react';
import { BoardState, GameStatus, Player } from '../interfaces/TicTacToeInterfaces';
import { checkWinner, getBestMove } from '../utils/ticTacToeLogic';

export const useTicTacToeGame = (
  onGameComplete: () => void,
  onPlayAgain: () => void,
  difficulty = 1
) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false); // CPU starts first by default
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
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

  return {
    board,
    isPlayerTurn,
    gameStatus,
    showInstructions,
    cpuWins,
    playerFirstMove,
    handleCellClick,
    handleContinue,
    handlePlayAgain
  };
};
