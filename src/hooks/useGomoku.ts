import { useState, useCallback } from 'react';
import { checkWin } from '../utils/winDetector';

const BOARD_SIZE = 15;

const createEmptyBoard = () =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));

export function useGomoku() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [history, setHistory] = useState<number[][][]>([]);
  const [moveHistory, setMoveHistory] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<1 | 2>(1); // 1 = Black, 2 = White
  const [winner, setWinner] = useState<number | null>(null);
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(null);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setHistory([]);
    setMoveHistory([]);
    setTurn(1);
    setWinner(null);
    setWinningLine(null);
    setLastMove(null);
  }, []);

  const placeStone = useCallback(
    (row: number, col: number): boolean => {
      // Move validation
      if (
        row < 0 ||
        row >= BOARD_SIZE ||
        col < 0 ||
        col >= BOARD_SIZE ||
        board[row][col] !== 0 ||
        winner !== null
      ) {
        return false;
      }

      // Save history for undoing
      const boardCopy = board.map((r) => [...r]);
      setHistory((prev) => [...prev, boardCopy]);
      setMoveHistory((prev) => [...prev, [row, col]]);

      // Update board with current turn
      const nextBoard = board.map((r, rIdx) =>
        r.map((cell, cIdx) => (rIdx === row && cIdx === col ? turn : cell))
      );
      setBoard(nextBoard);
      setLastMove([row, col]);

      // Check win
      const winResult = checkWin(nextBoard, row, col);
      if (winResult) {
        setWinner(winResult.winner);
        setWinningLine(winResult.line);
        return true;
      }

      // Check draw
      const isDraw = nextBoard.every((r) => r.every((cell) => cell !== 0));
      if (isDraw) {
        setWinner(0); // 0 indicates draw
        return true;
      }

      // Toggle turn
      setTurn((prev) => (prev === 1 ? 2 : 1));
      return true;
    },
    [board, winner, turn]
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;

    // Single move rollback
    const targetStateIndex = history.length - 1;
    setBoard(history[targetStateIndex]);
    setHistory((prev) => prev.slice(0, targetStateIndex));

    const newMoveHistory = moveHistory.slice(0, targetStateIndex);
    setMoveHistory(newMoveHistory);
    setLastMove(newMoveHistory.length > 0 ? newMoveHistory[newMoveHistory.length - 1] : null);

    setWinner(null);
    setWinningLine(null);
    setTurn((prev) => (prev === 1 ? 2 : 1));
  }, [history, moveHistory]);

  return {
    board,
    turn,
    winner,
    winningLine,
    lastMove,
    placeStone,
    undo,
    resetGame,
    moveCount: moveHistory.length,
  };
}
