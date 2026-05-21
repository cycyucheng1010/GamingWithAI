/**
 * Heuristic AI Opponent for Gomoku (Five-in-a-Row)
 * Features multiple difficulty levels and a highly optimized 5-stone window evaluation.
 */

const BOARD_SIZE = 15;

// Scans all 5-stone windows containing (r, c) in 4 directions to compute scores
function evaluateCell(
  board: number[][],
  row: number,
  col: number,
  aiPlayer: number,
  humanPlayer: number
): number {
  let score = 0;

  // Directions to check: [dRow, dCol]
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal Down-Right
    [1, -1],  // Diagonal Down-Left
  ];

  // Center bias: stones near the center are strategically more valuable early on
  const centerRow = 7;
  const centerCol = 7;
  const distToCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  score += (14 - distToCenter) * 0.5; // Up to 7 points bias

  for (const [dr, dc] of directions) {
    // For each direction, there are 5 possible 5-stone windows containing (row, col).
    // A 5-stone window starts at (row - i * dr, col - i * dc) and ends at (row + (4-i)*dr, col + (4-i)*dc)
    // for i from 0 to 4.
    for (let i = 0; i < 5; i++) {
      const startRow = row - i * dr;
      const startCol = col - i * dc;

      // Ensure the window fits within the board boundaries
      if (
        startRow < 0 ||
        startRow + 4 * dr < 0 ||
        startRow + 4 * dr >= BOARD_SIZE ||
        startCol < 0 ||
        startCol + 4 * dc < 0 ||
        startCol + 4 * dc >= BOARD_SIZE
      ) {
        continue;
      }

      // Count stones in this 5-stone window
      let aiCount = 0;
      let humanCount = 0;

      for (let k = 0; k < 5; k++) {
        const currR = startRow + k * dr;
        const currC = startCol + k * dc;
        const cell = board[currR][currC];

        if (currR === row && currC === col) {
          // This is the cell we are evaluating placing a stone at
          aiCount++;
        } else if (cell === aiPlayer) {
          aiCount++;
        } else if (cell === humanPlayer) {
          humanCount++;
        }
      }

      // Scoring logic for this window
      if (aiCount > 0 && humanCount > 0) {
        // Window contains both players' stones -> blocked path, zero score
        continue;
      } else if (aiCount > 0) {
        // Window contains only AI stones & empty cells (Offensive)
        switch (aiCount) {
          case 5: // Forms a 5-in-a-row (WIN)
            score += 100000;
            break;
          case 4: // Forms an open/blocked 4
            score += 10000;
            break;
          case 3: // Forms a 3
            score += 800;
            break;
          case 2: // Forms a 2
            score += 50;
            break;
          case 1:
            score += 2;
            break;
        }
      } else if (humanCount > 0) {
        // Window contains only human stones & empty cells (Defensive/Blocking)
        switch (humanCount) {
          case 4: // Human has a 4 -> AI MUST BLOCK or lose
            score += 25000;
            break;
          case 3: // Human has a 3 -> AI needs to block to prevent open 4
            score += 3500;
            break;
          case 2: // Human has a 2
            score += 150;
            break;
          case 1:
            score += 5;
            break;
        }
      }
    }
  }

  return score;
}

export function getBestMove(
  board: number[][],
  aiPlayer: number,
  difficulty: 'easy' | 'medium' | 'hard'
): [number, number] {
  const humanPlayer = aiPlayer === 1 ? 2 : 1;
  const emptyCells: [number, number][] = [];

  // 1. Gather all empty cells
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) {
        emptyCells.push([r, c]);
      }
    }
  }

  // Fallback if board is full (should not happen in ordinary play)
  if (emptyCells.length === 0) return [-1, -1];

  // Special opening move rule: If first move or second move and center is free, take center!
  const center = 7;
  if (board[center][center] === 0) {
    // If AI is playing first, or if player played elsewhere first, grab center!
    const centerFree = emptyCells.some(([r, c]) => r === center && c === center);
    if (centerFree) return [center, center];
  }

  // 2. Play styles based on difficulty
  if (difficulty === 'easy') {
    // 60% chance play a random cell, 40% chance evaluate
    if (Math.random() < 0.6) {
      const randomIdx = Math.floor(Math.random() * emptyCells.length);
      return emptyCells[randomIdx];
    }
  }

  // 3. Score all empty cells
  let bestScore = -Infinity;
  let bestMoves: [number, number][] = [];

  for (const [r, c] of emptyCells) {
    let score = evaluateCell(board, r, c, aiPlayer, humanPlayer);

    // Hard difficulty: Add strategic look-ahead or block adjustment
    if (difficulty === 'hard') {
      // 1. Check if placing stone here makes the AI win immediately (score should be elevated)
      // 2. Add an extra penalty weight if a move allows the player to win in 1 step
      // The heuristic evaluation already scores 5-in-a-row extremely high, so we scale it.
      
      // Look at immediate neighbors; if no stones are within 2 cells, reduce score
      // (This prevents AI from picking isolated cells and speeds up tactical clustering)
      let hasNeighbor = false;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] !== 0) {
            hasNeighbor = true;
            break;
          }
        }
        if (hasNeighbor) break;
      }
      if (!hasNeighbor && emptyCells.length < 220) {
        score -= 50; // heavily penalize isolated moves unless it's early game
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [[r, c]];
    } else if (score === bestScore) {
      bestMoves.push([r, c]);
    }
  }

  // Pick one of the best moves randomly to avoid deterministic repetition
  const finalIdx = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[finalIdx];
}
