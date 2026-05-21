# Complete System Prompt: Scaffolding a Premium Traditional Gomoku Game

This document provides a highly detailed, comprehensive prompt designed to guide any advanced AI coding assistant to implement an identical, pixel-perfect, premium traditional **Gomoku (Five-in-a-Row)** board game in React, TypeScript, and Vite, featuring Web Audio synthesis and local two-player support.

---

## The AI Prompt

Copy the entire block below and feed it to another AI model to recreate this game:

```markdown
You are an expert frontend developer and UI/UX designer. Your task is to build a premium, highly elegant, traditional minimalist **Gomoku (Five-in-a-Row)** board game using **React, TypeScript, and Vite** (scaffolded in a single-page architecture). The application must operate purely as a local two-player board, adhering to traditional rules where Black plays first and White plays second.

Follow these strict specifications for core logic, visual styling, and acoustic feedback:

---

### 1. Visual Theme & Styling (CSS)
Create a luxurious, minimalist design centered on traditional materials (wooden boards, glossy minerals, and slate tones) rather than modern neon/digital effects:
1. **Backdrop**: A deep, matte slate-charcoal background (`#121820` with a linear vignette gradient to `#0a0d13`) that keeps the visual focus entirely on the board.
2. **Gomoku Board**: 
   - A warm, rich, natural wooden board rendering via gradients: `linear-gradient(135deg, #e5ba7d 0%, #cc9f62 100%)`.
   - Surrounded by a solid, thick mahogany border: `6px solid #422d17`.
   - Gridlines: Fine, sharp charcoal-colored crossing lines (`rgba(43, 29, 12, 0.28)`).
   - Classic Star Points (Hoshi Points): Solid, matte black dots centered at indices `(3,3), (3,11), (7,7), (11,3), (11,11)` on the 15x15 board.
3. **Stones**:
   - **Black Stones (Player 1)**: Authentic glossy Slate Black stones. Rendered using `radial-gradient(circle at 30% 30%, #3a3a3a 0%, #151515 45%, #050505 85%, #000000 100%)`, fine white borders, and deep drop shadows.
   - **White Stones (Player 2)**: Polished Shell White stones. Rendered using `radial-gradient(circle at 30% 30%, #ffffff 0%, #f6f6f6 30%, #e2e2e2 75%, #bbbbbb 100%)`, fine gray borders, and soft drop shadows.
   - Implement realistic 3D elevated depth using `filter: drop-shadow(3px 4px 5px rgba(0, 0, 0, 0.4))`.
4. **State Indicators**:
   - **No Hover Auxiliary Guides**: When hovering over empty cells, do NOT show any ghost stone shapes or preview guides. Keep the board clean, showing only a standard `cursor: pointer`.
   - **Last Move Indicator**: Mark the absolute last stone placed with a precise, small red dot (`#d32f2f`) centered on the stone.
   - **Winning Connection**: An elegant golden thread overlay (`#ffd700` drawn via SVG overlay or CSS line between coordinates) pulsing smoothly on victory.
5. **HUD Sidebar**: Translucent glassmorphism panels (`rgba(26, 34, 46, 0.75)` with very fine borders) showing:
   - Turn state: "目前回合：黑子 (先手)" or "白子 (後手)" with matching color dots.
   - Scoreboard tracking cumulative wins for Black and White.
   - Controls: "回退一手 (Undo)" and "重新開局 (Reset)".
   - 落子記錄 (Move logs): A scrollable database feed listing all past moves in traditional coordinates (e.g. `[1] 黑子：H8`, `[2] 白子：H9`).

---

### 2. Core Logic & States
Implement state management with the following modules:
- **Board Grid**: A 15x15 2D array (`board[15][15]`), where `0` is empty, `1` is Black, and `2` is White.
- **Directional Win Detector**:
  - To optimize performance, only check for wins starting from the last placed coordinate `(lastRow, lastCol)`.
  - Scan in four directions:
    1. Horizontal (`[0, 1]`)
    2. Vertical (`[1, 0]`)
    3. Primary Diagonal (`[1, 1]`)
    4. Secondary Diagonal (`[1, -1]`)
  - A win is detected if 5 or more consecutive stones of the same player are connected. Return the winner and the list of winning coordinates.
  - Draw is declared if the grid is fully occupied with no winner.
- **Gameplay Commands**:
  - `placeStone(row, col)`: Validate coordinate, update turn, check win, add to history.
  - `undo()`: Single-turn rollback of history (pop last board state off history stack).
  - `resetGame()`: Reinitialize board state, clear logs, reset turn to 1 (Black).

---

### 3. Tactile Audio Synthesizer (Web Audio API)
Synthesize acoustic sound effects purely through browser native JavaScript to avoid downloading external audio assets:
1. **Wood Click SFX**:
   - Frequency: Fast sine wave sweep decaying from `580Hz` to `120Hz` in 0.045 seconds.
   - Contact noise: Combine with a sharp high-pass filtered white noise burst (`>2500Hz`) lasting `0.006` seconds to simulate a heavy stone clicking on a dense timber grid.
2. **Victory Harpsichord**:
   - Play an ascending major chord sweep (e.g., C4, E4, G4, C5, E5, G5, C6) with sine wave oscillators, staggered by `0.06` seconds, creating a rewarding triumph chord.
3. **Mute Control**: Allow users to toggle sound effects on/off from the HUD interface.

---

### 4. Implementation Structure

Please split the code cleanly into:
1. **`src/utils/winDetector.ts`**: Contains pure `checkWin(board, lastRow, lastCol)` algorithm returning `null` or `{ winner, line: [number, number][] }`.
2. **`src/hooks/useGomoku.ts`**: React custom hook wrapping state logic, histories, turn switches, placement validation, and reset.
3. **`src/App.tsx`**: Main component compiling the layout, Web Audio synthesis engine class, HUD scoreboards, log feeds, and rendering the 15x15 cells.
4. **`src/App.css`**: CSS stylesheet detailing the custom timber board grids, glossy slate/shell stones, gold pulsing, and responsive designs.
5. **`index.html`**: Clean page structure with descriptive titles and SEO meta descriptions.

Deliver complete, compilable, clean code ready to run on Vite.
```
