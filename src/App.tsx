import { useState } from 'react';
import './App.css';
import { MainMenu } from './components/MainMenu';
import { GomokuGame } from './components/GomokuGame';
import { JapaneseGame } from './components/JapaneseGame';

type ScreenState = 'menu' | 'gomoku' | 'japanese';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('menu');

  const handleSelectGame = (game: 'gomoku' | 'japanese') => {
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
    case 'menu':
    default:
      return <MainMenu onSelectGame={handleSelectGame} />;
  }
}
