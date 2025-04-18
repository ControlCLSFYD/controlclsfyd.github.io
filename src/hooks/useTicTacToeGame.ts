import { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O' | null;
type BoardState = (Player)[];
type GameStatus = 'playing' | 'won' | 'lost' | 'draw';

interface UseTicTacToeGameOptions {
  difficulty?: number;
  cpuMovesFirst?: boolean;
}

export const useTicTacToeGame = ({ 
  difficulty = 5,
  cpuMovesFirst = true
}: UseTicTacToeGameOptions = {}) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(!cpuMovesFirst);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [showInstructions, setShowInstructions] = useState(true);
  const [initialCpuMoveCompleted, setInitialCpuMoveCompleted] = useState(false);

  const checkWinner = useCallback((board: BoardState, player: Player): boolean => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];
    
    return winPatterns.some(pattern =>
      pattern.every(index => board[index] === player)
    );
  }, []);

  const getAvailableMoves = useCallback((board: BoardState): number[] => {
    return board.reduce((acc, cell, index) => 
      !cell ? [...acc, index] : acc, [] as number[]);
  }, []);

  const minimax = useCallback((board: BoardState, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): { score: number; move?: number } => {
    if (checkWinner(board, 'X')) return { score: 10 - depth };
    if (checkWinner(board, 'O')) return { score: depth - 10 };
    
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) return { score: 0 };
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove;
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = 'X';
        
        const result = minimax(newBoard, depth + 1, false, alpha, beta);
        
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }
      
      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove;
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = 'O';
        
        const result = minimax(newBoard, depth + 1, true, alpha, beta);
        
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }
      
      return { score: bestScore, move: bestMove };
    }
  }, [checkWinner, getAvailableMoves]);

  const getBestMove = useCallback((board: BoardState): number => {
    const result = minimax(board, 0, true);
    
    if (result.move !== undefined) {
      return result.move;
    }
    
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.includes(4)) return 4;
    return availableMoves[0];
  }, [getAvailableMoves, minimax]);

  const makeCpuMove = useCallback(() => {
    if (gameStatus !== 'playing' || isPlayerTurn) return;
    
    const computerMoveIndex = getBestMove(board);
    const newBoard = [...board];
    newBoard[computerMoveIndex] = 'X';
    
    setBoard(newBoard);
    
    if (checkWinner(newBoard, 'X')) {
      setGameStatus('lost');
    } else if (!newBoard.includes(null)) {
      setGameStatus('draw');
    } else {
      setIsPlayerTurn(true);
    }
  }, [board, checkWinner, gameStatus, getBestMove, isPlayerTurn]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setGameStatus('playing');
    setIsPlayerTurn(!cpuMovesFirst);
    setShowInstructions(true);
    setInitialCpuMoveCompleted(false);
    
    const timer = setTimeout(() => {
      setShowInstructions(false);
      
      if (cpuMovesFirst) {
        setTimeout(() => {
          if (!initialCpuMoveCompleted) {
            const initialMove = getBestMove(Array(9).fill(null));
            const newBoard = Array(9).fill(null);
            newBoard[initialMove] = 'X';
            setBoard(newBoard);
            setIsPlayerTurn(true);
            setInitialCpuMoveCompleted(true);
          }
        }, 100);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [cpuMovesFirst, getBestMove, initialCpuMoveCompleted]);

  const handleCellClick = useCallback((index: number) => {
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
  }, [board, checkWinner, gameStatus, isPlayerTurn]);

  useEffect(() => {
    resetGame();
  }, [resetGame, cpuMovesFirst]);

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing' && !showInstructions) {
      makeCpuMove();
    }
  }, [isPlayerTurn, gameStatus, showInstructions, makeCpuMove]);

  return {
    board,
    gameStatus,
    isPlayerTurn,
    showInstructions,
    handleCellClick,
    resetGame
  };
};
