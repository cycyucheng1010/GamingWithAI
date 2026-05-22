import { useState, useCallback } from 'react';

export type IntersectionState = 0 | 1 | 2; // 0=EMPTY, 1=BLACK, 2=WHITE

export interface ScoreDetails {
  blackStones: number;
  whiteStones: number;
  blackTerritory: number;
  whiteTerritory: number;
  blackTotal: number;
  whiteTotal: number;
  komi: number;
  winner: 'Black' | 'White';
  margin: number;
}

export function useGo(initialSize: number = 19, komi: number = 7.5) {
  const [boardSize, setBoardSize] = useState(initialSize);
  const [board, setBoard] = useState<IntersectionState[][]>(() =>
    Array(initialSize).fill(null).map(() => Array(initialSize).fill(0))
  );
  const [turn, setTurn] = useState<1 | 2>(1); // 1=BLACK, 2=WHITE
  const [captures, setCaptures] = useState({ black: 0, white: 0 }); // Stones captured by black/white
  const [history, setHistory] = useState<string[]>([]); // Serialized board states for undo
  const [passCount, setPassCount] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to serialize board state for history / Ko / Superko comparison
  const serializeBoard = useCallback((b: IntersectionState[][]) => {
    return b.map(row => row.join('')).join('|');
  }, []);

  const deserializeBoard = useCallback((s: string, size: number) => {
    const rows = s.split('|');
    const b: IntersectionState[][] = Array(size).fill(null).map(() => Array(size).fill(0));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        b[r][c] = parseInt(rows[r][c]) as IntersectionState;
      }
    }
    return b;
  }, []);

  // Helper: Get adjacent coordinates inside board bounds
  const getAdjacents = useCallback((r: number, c: number, size: number) => {
    const adj = [];
    if (r > 0) adj.push({ r: r - 1, c });
    if (r < size - 1) adj.push({ r: r + 1, c });
    if (c > 0) adj.push({ r, c: c - 1 });
    if (c < size - 1) adj.push({ r, c: c + 1 });
    return adj;
  }, []);

  // Helper: Find connected group (string) of same color starting from (r, c)
  const getGroup = useCallback((
    b: IntersectionState[][],
    startR: number,
    startC: number,
    size: number
  ) => {
    const color = b[startR][startC];
    if (color === 0) return { stones: [], liberties: new Set<string>() };

    const visited = new Set<string>();
    const stones: { r: number; c: number }[] = [];
    const liberties = new Set<string>();
    const queue = [{ r: startR, c: startC }];
    
    visited.add(`${startR},${startC}`);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      stones.push(curr);

      const adjacents = getAdjacents(curr.r, curr.c, size);
      adjacents.forEach(adj => {
        const adjKey = `${adj.r},${adj.c}`;
        const adjColor = b[adj.r][adj.c];
        
        if (adjColor === 0) {
          liberties.add(adjKey);
        } else if (adjColor === color && !visited.has(adjKey)) {
          visited.add(adjKey);
          queue.push(adj);
        }
      });
    }

    return { stones, liberties };
  }, [getAdjacents]);

  // Automated Territory Scoring (Chinese Area Scoring)
  const calculateScore = useCallback((b: IntersectionState[][], size: number): ScoreDetails => {
    let blackStones = 0;
    let whiteStones = 0;
    
    // Count stones on board
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (b[r][c] === 1) blackStones++;
        else if (b[r][c] === 2) whiteStones++;
      }
    }

    // Flood fill empty spaces to estimate territories
    const visited = Array(size).fill(null).map(() => Array(size).fill(false));
    let blackTerritory = 0;
    let whiteTerritory = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (b[r][c] === 0 && !visited[r][c]) {
          // Found an empty region, let's BFS
          const region: { r: number; c: number }[] = [];
          const queue = [{ r, c }];
          visited[r][c] = true;
          
          const adjacentColors = new Set<number>();

          while (queue.length > 0) {
            const curr = queue.shift()!;
            region.push(curr);

            const adjacents = getAdjacents(curr.r, curr.c, size);
            adjacents.forEach(adj => {
              const adjColor = b[adj.r][adj.c];
              if (adjColor === 0) {
                if (!visited[adj.r][adj.c]) {
                  visited[adj.r][adj.c] = true;
                  queue.push(adj);
                }
              } else {
                adjacentColors.add(adjColor);
              }
            });
          }

          // If region is bordered ONLY by black, it is black's territory
          if (adjacentColors.has(1) && !adjacentColors.has(2)) {
            blackTerritory += region.length;
          }
          // If region is bordered ONLY by white, it is white's territory
          else if (adjacentColors.has(2) && !adjacentColors.has(1)) {
            whiteTerritory += region.length;
          }
        }
      }
    }

    const blackTotal = blackStones + blackTerritory;
    const whiteTotal = whiteStones + whiteTerritory + komi;
    const winner: 'Black' | 'White' = blackTotal > whiteTotal ? 'Black' : 'White';
    const margin = Math.abs(blackTotal - whiteTotal);

    return {
      blackStones,
      whiteStones,
      blackTerritory,
      whiteTerritory,
      blackTotal,
      whiteTotal,
      komi,
      winner,
      margin
    };
  }, [getAdjacents, komi]);

  // Main Action: Play a stone
  const playStone = useCallback((r: number, c: number) => {
    if (winner) return false;
    setErrorMsg(null);

    // 1. Bounds & Empty Check
    if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) {
      setErrorMsg('錯誤：落子越界');
      return false;
    }
    if (board[r][c] !== 0) {
      setErrorMsg('錯誤：該點已有棋子');
      return false;
    }

    const playerColor = turn;
    const enemyColor = turn === 1 ? 2 : 1;

    // Simulate Board
    const nextBoard = board.map(row => [...row]);
    nextBoard[r][c] = playerColor;

    // 2. Identify Captures
    const capturedStones: { r: number; c: number }[] = [];
    const adjacents = getAdjacents(r, c, boardSize);

    // Find unique adjacent enemy groups
    const checkedEnemyStones = new Set<string>();
    adjacents.forEach(adj => {
      if (nextBoard[adj.r][adj.c] === enemyColor) {
        const key = `${adj.r},${adj.c}`;
        if (!checkedEnemyStones.has(key)) {
          const group = getGroup(nextBoard, adj.r, adj.c, boardSize);
          
          // Add all stones to checked
          group.stones.forEach(s => checkedEnemyStones.add(`${s.r},${s.c}`));

          // If no liberties left, they are captured!
          if (group.liberties.size === 0) {
            capturedStones.push(...group.stones);
          }
        }
      }
    });

    // Remove captured stones from board
    capturedStones.forEach(s => {
      nextBoard[s.r][s.c] = 0;
    });

    // 3. Suicide Check
    const ownGroup = getGroup(nextBoard, r, c, boardSize);
    if (ownGroup.liberties.size === 0 && capturedStones.length === 0) {
      setErrorMsg('錯誤：此處為禁著點（自殺規則限制）');
      return false;
    }

    // 4. Ko / Superko Check
    const nextSerialized = serializeBoard(nextBoard);
    
    // Simple Ko Check (reverting immediate previous step)
    if (history.length > 0 && history[history.length - 1] === nextSerialized) {
      setErrorMsg('錯誤：打劫限制，禁止立即回提');
      return false;
    }

    // Superko Check (re-creating any state in history)
    if (history.includes(nextSerialized)) {
      setErrorMsg('錯誤：全局同型再現（Superko）限制');
      return false;
    }

    // 5. Update State (Move Approved!)
    setBoard(nextBoard);
    setHistory(prev => [...prev, serializeBoard(board)]); // Store previous board for undo
    
    // Add captures
    if (capturedStones.length > 0) {
      setCaptures(prev => {
        if (playerColor === 1) {
          return { ...prev, black: prev.black + capturedStones.length };
        } else {
          return { ...prev, white: prev.white + capturedStones.length };
        }
      });
    }

    // Reset pass count
    setPassCount(0);

    // Swap turn
    setTurn(enemyColor);
    return true;
  }, [board, boardSize, turn, history, getAdjacents, getGroup, serializeBoard, winner]);

  // Special Action: Pass
  const pass = useCallback(() => {
    if (winner) return;
    setErrorMsg(null);

    const nextPassCount = passCount + 1;
    setPassCount(nextPassCount);
    
    setHistory(prev => [...prev, serializeBoard(board)]);

    // Check End of Game
    if (nextPassCount >= 2) {
      const finalScore = calculateScore(board, boardSize);
      setScoreResult(finalScore);
      setWinner(finalScore.winner);
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }
  }, [board, boardSize, turn, passCount, serializeBoard, calculateScore, winner]);

  // Special Action: Resign
  const resign = useCallback((player: 'Black' | 'White') => {
    if (winner) return;
    setErrorMsg(null);
    const winColor = player === 'Black' ? 'White' : 'Black';
    setWinner(winColor);
  }, [winner]);

  // Undo last move
  const undo = useCallback(() => {
    if (history.length === 0) return;
    setErrorMsg(null);

    const prevHistory = [...history];
    const prevSerialized = prevHistory.pop()!;
    
    setBoard(deserializeBoard(prevSerialized, boardSize));
    setHistory(prevHistory);
    setTurn(turn === 1 ? 2 : 1);
    setPassCount(0);
    setWinner(null);
    setScoreResult(null);
  }, [history, boardSize, turn, deserializeBoard]);

  // Reset Game
  const resetGame = useCallback((size: number = boardSize) => {
    setBoardSize(size);
    setBoard(Array(size).fill(null).map(() => Array(size).fill(0)));
    setTurn(1);
    setCaptures({ black: 0, white: 0 });
    setHistory([]);
    setPassCount(0);
    setWinner(null);
    setScoreResult(null);
    setErrorMsg(null);
  }, [boardSize]);

  // Real-time Score Estimation
  const getScoreEstimate = useCallback(() => {
    return calculateScore(board, boardSize);
  }, [board, boardSize, calculateScore]);

  return {
    board,
    boardSize,
    turn,
    captures,
    winner,
    scoreResult,
    errorMsg,
    passCount,
    playStone,
    pass,
    resign,
    undo,
    resetGame,
    getScoreEstimate,
    historyLength: history.length,
  };
}
