# Gaming with AI - Multi-Game Hub

A premium, interactive web application featuring an elegant collection of classic and educational games. Developed using **React 19**, **TypeScript**, and **Vite**, with a highly polished dark-glassmorphism design system and rich audio synthesis.

---

## 🎮 Game Center Selection Menu

At launch, users are greeted by a sleek, modern selection hub that lets them choose between two highly polished experiences:
*   **Gomoku Arena**: A traditional board game.
*   **Japanese Word Master (日語單字達人)**: An educational suite.

---

## 🎯 Game 1: Gomoku Arena (五子棋競技場)

An elegant, traditional five-in-a-row board game. 

### 🌟 Key Features
*   **15x15 Standard Board**: Fully responsive grid featuring standard star points (hoshi points) and clear grid intersection hitboxes.
*   **Stone-Strike Audio Engine**: Uses the browser's native **Web Audio API** to dynamically synthesize rich wood-on-stone click sounds on every placement, providing tactile auditory feedback.
*   **対局資訊 (HUD Panel)**: Real-time turn tracking (先手 Black / 後手 White) and move coordinates logging using traditional alphanumeric notation (e.g., `H8`).
*   **Robust Game Controls**:
    *   **Undo (回退一手)**: Instantly undo the last placed stone and revert the game log state.
    *   **Reset (重新開局)**: Flush the active board and logs to start fresh.
*   **Accumulated Win Scores**: Tracks session wins for both black and white players.
*   **Pixel-Perfect Winning Overlays**: An absolute SVG overlay draws an elegant gold line connecting the winning five stones with smooth dash-array draw animations.

---

## 🌸 Game 2: Japanese Word Master (日語單字達人)

An educational game hub designed to help users memorize Hiragana, Katakana, and common Japanese words across multiple interactive formats.

### 📚 Vocabulary Decks Included
*   **平假名基礎 (Hiragana Basics)**: Fifty-sound Hiragana matching and spelling.
*   **片假名基礎 (Katakana Basics)**: Foreign loanword Katakana characters.
*   **生活問候 (Greetings)**: High-frequency everyday phrases (e.g., *Konnichiwa*, *Arigatou*).
*   **美食餐飲 (Food & Drink)**: Popular Japanese food items (e.g., *Sushi*, *Ramen*, *Ocha*).
*   **旅遊出行 (Travel & Places)**: Crucial navigation and travel vocabulary (e.g., *Eki*, *Hoteru*).

### 🃏 Game Modes

#### 1. Kana Match (連連看卡牌配對)
*   **How it Works**: A 3D memory board of cards. Pair the Japanese character/word card with its matching English romaji card.
*   **Interactive Design**: Feature fluid 3D flip card animations (`perspective: 1000px`), locking green matches, and error-shaking red mismatches. Tracks timer and total flip moves.

#### 2. Word Quiz (單字四選一挑戰)
*   **How it Works**: A classic flashcard multiple-choice mode. Read the Japanese word, listen to the pronunciation, and choose the correct meaning from 4 options.
*   **Voice Integration**: Uses the **Web Speech API (`window.speechSynthesis`)** to read out vocabulary with native Japanese accentuation (`ja-JP`) whenever a flashcard is opened or tapped.
*   **Streak Multipliers (🔥)**: Tracks consecutive correct answers to activate point multipliers.

#### 3. Kana Typer (打字暴風)
*   **How it Works**: Word bubbles fall from the top of the screen at speeds increasing with your score. Type the correct English romaji (e.g. typing `sushi` for `すし`) to blow up the bubble.
*   **Hyper-Responsive Feedback**: Popping occurs instantly *as you type*—no need to hit enter. Combos reward you with point boosts. Includes a 5-life system.

---

## 🔊 Audio & Speech Systems

This application requires **zero external audio files**, making it extremely lightweight and fast to load:
1.  **Sound FX Synthesis (Web Audio API)**: Generates sound frequencies on-the-fly:
    *   *Correct Match/Answer*: Double-tone sine chime (C5 to E5).
    *   *Incorrect Match/Answer*: Low sawtooth frequency slide down (150Hz to 100Hz).
    *   *Bubble Pop (Typer)*: High-frequency sine drop (900Hz to 180Hz in 60ms).
    *   *Victory/Clear*: An ascending C-Major harp sweep arpeggio.
2.  **Voice Pronunciation (Web Speech API)**: Uses native browser speech engines to synthesize fluent Japanese pronunciation.

---

## 🚀 Quick Start & Installation

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/)

### 1. Install Dependencies
Navigate to the directory and install required npm packages:
```bash
npm install
```

### 2. Start Development Server
Run the local Vite dev server:
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser to play the game!

### 3. Build for Production
Compile and optimize the app for deployment:
```bash
npm run build
```
This generates optimized, production-ready static assets in the `dist/` directory.

---

## 🛠️ Tech Stack & Design Architecture
*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Premium Vanilla CSS supporting variables, custom dark themes, glassmorphism (`backdrop-filter`), flex/grid layouts, and responsive CSS keyframe animations.
*   **Audio Synthesis**: Web Audio API (Synthesizers)
*   **Voice Synthesis**: Web Speech API (`SpeechSynthesis`)
