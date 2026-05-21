/**
 * Core win detection logic for Gomoku (Five-in-a-Row)
 * Highly optimized to scan only the lines intersecting the last move.
 */

export interface WinResult {
  winner: number;
  line: [number, number][];
}

export function checkWin(
  board: number[][],
  lastRow: number,
  lastCol: number
): WinResult | null {
  if (lastRow < 0 || lastCol < 0) return null;

  const player = board[lastRow][lastCol];
  if (player === 0) return null;

  const BOARD_SIZE = board.length;

  // Directions: [dRow, dCol]
  // 1. Horizontal: [0, 1]
  // 2. Vertical: [1, 0]
  // 3. Primary Diagonal (top-left to bottom-right): [1, 1]
  // 4. Secondary Diagonal (bottom-left to top-right): [1, -1]
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const matchingStones: [number, number][] = [[lastRow, lastCol]];

    // Scan forward (positive direction)
    let r = lastRow + dr;
    let c = lastCol + dc;
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === player
    ) {
      matchingStones.push([r, c]);
      r += dr;
      c += dc;
    }

    // Scan backward (negative direction)
    r = lastRow - dr;
    c = lastCol - dc;
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === player
    ) {
      matchingStones.push([r, c]);
      r -= dr;
      c -= dc;
    }

    // Victory condition: 5 or more stones in a line
    if (matchingStones.length >= 5) {
      // Sort matching stones for logical order (e.g. from top-left/left to bottom-right/right)
      matchingStones.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      return {
        winner: player,
        line: matchingStones,
      };
    }
  }

  return null;
}
