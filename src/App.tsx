import { useState } from 'react';
import './App.css';
import { MainMenu } from './components/MainMenu';
import { GomokuGame } from './components/GomokuGame';
import { JapaneseGame } from './components/JapaneseGame';
import { GoGame } from './components/GoGame';

type ScreenState = 'menu' | 'gomoku' | 'japanese' | 'go';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('menu');

  const handleSelectGame = (game: 'gomoku' | 'japanese' | 'go') => {
    setCurrentScreen(game);
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  switch (currentScreen) {
    case 'gomoku':
      return <GomokuGame onBackToMenu={handleBackToMenu} />;
    case 'japanese':
      return <JapaneseGame onBackToMenu={handleBackToMenu} />;
    case 'go':
      return <GoGame onBackToMenu={handleBackToMenu} />;
    case 'menu':
    default:
      return <MainMenu onSelectGame={handleSelectGame} />;
  }
}
