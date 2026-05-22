import React, { useState, useEffect, useRef } from 'react';

// Vocabulary categories and items
interface VocabItem {
  id: string;
  japanese: string;  // Kanji/Kana
  hiragana: string;  // Pure Hiragana/Katakana for matching/typing
  romaji: string;    // Pronunciation / Typing target
  english: string;   // English translation
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: VocabItem[];
}

const VOCAB_DATABASE: Category[] = [
  {
    id: 'hiragana_basic',
    name: '平假名基礎 (Hiragana)',
    description: '學習日語最基礎的五十音平假名',
    icon: '🌸',
    items: [
      { id: 'h1', japanese: 'あ', hiragana: 'あ', romaji: 'a', english: 'a' },
      { id: 'h2', japanese: 'い', hiragana: 'い', romaji: 'i', english: 'i' },
      { id: 'h3', japanese: 'う', hiragana: 'う', romaji: 'u', english: 'u' },
      { id: 'h4', japanese: 'え', hiragana: 'え', romaji: 'e', english: 'e' },
      { id: 'h5', japanese: 'お', hiragana: 'お', romaji: 'o', english: 'o' },
      { id: 'h6', japanese: 'か', hiragana: 'か', romaji: 'ka', english: 'ka' },
      { id: 'h7', japanese: 'き', hiragana: 'き', romaji: 'ki', english: 'ki' },
      { id: 'h8', japanese: 'く', hiragana: 'く', romaji: 'ku', english: 'ku' },
      { id: 'h9', japanese: 'け', hiragana: 'け', romaji: 'ke', english: 'ke' },
      { id: 'h10', japanese: 'こ', hiragana: 'こ', romaji: 'ko', english: 'ko' },
      { id: 'h11', japanese: 'さ', hiragana: 'さ', romaji: 'sa', english: 'sa' },
      { id: 'h12', japanese: 'し', hiragana: 'し', romaji: 'shi', english: 'shi' },
      { id: 'h13', japanese: 'す', hiragana: 'す', romaji: 'su', english: 'su' },
      { id: 'h14', japanese: 'せ', hiragana: 'せ', romaji: 'se', english: 'se' },
      { id: 'h15', japanese: 'そ', hiragana: 'そ', romaji: 'so', english: 'so' },
      { id: 'h16', japanese: 'た', hiragana: 'た', romaji: 'ta', english: 'ta' },
      { id: 'h17', japanese: 'ち', hiragana: 'ち', romaji: 'chi', english: 'chi' },
      { id: 'h18', japanese: 'つ', hiragana: 'つ', romaji: 'tsu', english: 'tsu' },
      { id: 'h19', japanese: 'て', hiragana: 'て', romaji: 'te', english: 'te' },
      { id: 'h20', japanese: 'と', hiragana: 'と', romaji: 'to', english: 'to' },
      { id: 'h21', japanese: 'な', hiragana: 'な', romaji: 'na', english: 'na' },
      { id: 'h22', japanese: 'ニ', hiragana: 'に', romaji: 'ni', english: 'ni' },
      { id: 'h23', japanese: 'ぬ', hiragana: 'ぬ', romaji: 'nu', english: 'nu' },
      { id: 'h24', japanese: 'ね', hiragana: 'ね', romaji: 'ne', english: 'ne' },
      { id: 'h25', japanese: 'の', hiragana: 'の', romaji: 'no', english: 'no' },
      { id: 'h26', japanese: 'は', hiragana: 'は', romaji: 'ha', english: 'ha' },
      { id: 'h27', japanese: 'ひ', hiragana: 'ひ', romaji: 'hi', english: 'hi' },
      { id: 'h28', japanese: 'ふ', hiragana: 'ふ', romaji: 'fu', english: 'fu' },
      { id: 'h29', japanese: 'へ', hiragana: 'へ', romaji: 'he', english: 'he' },
      { id: 'h30', japanese: 'ほ', hiragana: 'ほ', romaji: 'ho', english: 'ho' },
      { id: 'h31', japanese: 'ま', hiragana: 'ま', romaji: 'ma', english: 'ma' },
      { id: 'h32', japanese: 'み', hiragana: 'み', romaji: 'mi', english: 'mi' },
      { id: 'h33', japanese: 'む', hiragana: 'む', romaji: 'mu', english: 'mu' },
      { id: 'h34', japanese: 'め', hiragana: 'め', romaji: 'me', english: 'me' },
      { id: 'h35', japanese: 'も', hiragana: 'も', romaji: 'mo', english: 'mo' },
      { id: 'h36', japanese: 'や', hiragana: 'や', romaji: 'ya', english: 'ya' },
      { id: 'h37', japanese: 'ゆ', hiragana: 'ゆ', romaji: 'yu', english: 'yu' },
      { id: 'h38', japanese: 'よ', hiragana: 'よ', romaji: 'yo', english: 'yo' },
      { id: 'h39', japanese: 'ら', hiragana: 'ら', romaji: 'ra', english: 'ra' },
      { id: 'h40', japanese: 'り', hiragana: 'り', romaji: 'ri', english: 'ri' },
      { id: 'h41', japanese: 'る', hiragana: 'る', romaji: 'ru', english: 'ru' },
      { id: 'h42', japanese: 'れ', hiragana: 'れ', romaji: 're', english: 're' },
      { id: 'h43', japanese: 'ろ', hiragana: 'ろ', romaji: 'ro', english: 'ro' },
      { id: 'h44', japanese: 'わ', hiragana: 'わ', romaji: 'wa', english: 'wa' },
      { id: 'h45', japanese: 'を', hiragana: 'を', romaji: 'wo', english: 'wo' },
      { id: 'h46', japanese: 'ん', hiragana: 'ん', romaji: 'n', english: 'n' },
    ]
  },
  {
    id: 'katakana_basic',
    name: '片假名基礎 (Katakana)',
    description: '學習用於外來語的五十音片假名',
    icon: '⚡',
    items: [
      { id: 'k1', japanese: 'ア', hiragana: 'ア', romaji: 'a', english: 'a' },
      { id: 'k2', japanese: 'イ', hiragana: 'イ', romaji: 'i', english: 'i' },
      { id: 'k3', japanese: 'ウ', hiragana: 'ウ', romaji: 'u', english: 'u' },
      { id: 'k4', japanese: 'エ', hiragana: 'エ', romaji: 'e', english: 'e' },
      { id: 'k5', japanese: 'オ', hiragana: 'オ', romaji: 'o', english: 'o' },
      { id: 'k6', japanese: 'カ', hiragana: 'カ', romaji: 'ka', english: 'ka' },
      { id: 'k7', japanese: 'キ', hiragana: 'キ', romaji: 'ki', english: 'ki' },
      { id: 'k8', japanese: 'ク', hiragana: 'ク', romaji: 'ku', english: 'ku' },
      { id: 'k9', japanese: 'ケ', hiragana: 'ケ', romaji: 'ke', english: 'ke' },
      { id: 'k10', japanese: 'コ', hiragana: 'コ', romaji: 'ko', english: 'ko' },
      { id: 'k11', japanese: 'サ', hiragana: 'サ', romaji: 'sa', english: 'sa' },
      { id: 'k12', japanese: 'シ', hiragana: 'シ', romaji: 'shi', english: 'shi' },
      { id: 'k13', japanese: 'ス', hiragana: 'ス', romaji: 'su', english: 'su' },
      { id: 'k14', japanese: 'セ', hiragana: 'セ', romaji: 'se', english: 'se' },
      { id: 'k15', japanese: 'ソ', hiragana: 'ソ', romaji: 'so', english: 'so' },
      { id: 'k16', japanese: 'タ', hiragana: 'タ', romaji: 'ta', english: 'ta' },
      { id: 'k17', japanese: 'チ', hiragana: 'チ', romaji: 'chi', english: 'chi' },
      { id: 'k18', japanese: 'ツ', hiragana: 'ツ', romaji: 'tsu', english: 'tsu' },
      { id: 'k19', japanese: 'テ', hiragana: 'テ', romaji: 'te', english: 'te' },
      { id: 'k20', japanese: 'ト', hiragana: 'ト', romaji: 'to', english: 'to' },
      { id: 'k21', japanese: 'ナ', hiragana: 'ナ', romaji: 'na', english: 'na' },
      { id: 'k22', japanese: 'ニ', hiragana: 'ニ', romaji: 'ni', english: 'ni' },
      { id: 'k23', japanese: 'ヌ', hiragana: 'ヌ', romaji: 'nu', english: 'nu' },
      { id: 'k24', japanese: 'ネ', hiragana: 'ネ', romaji: 'ne', english: 'ne' },
      { id: 'k25', japanese: 'ノ', hiragana: 'ノ', romaji: 'no', english: 'no' },
      { id: 'k26', japanese: 'ハ', hiragana: 'ハ', romaji: 'ha', english: 'ha' },
      { id: 'k27', japanese: 'ヒ', hiragana: 'ヒ', romaji: 'hi', english: 'hi' },
      { id: 'k28', japanese: 'フ', hiragana: 'フ', romaji: 'fu', english: 'fu' },
      { id: 'k29', japanese: 'ヘ', hiragana: 'ヘ', romaji: 'he', english: 'he' },
      { id: 'k30', japanese: 'ホ', hiragana: 'ホ', romaji: 'ho', english: 'ho' },
      { id: 'k31', japanese: 'マ', hiragana: 'マ', romaji: 'ma', english: 'ma' },
      { id: 'k32', japanese: 'ミ', hiragana: 'ミ', romaji: 'mi', english: 'mi' },
      { id: 'k33', japanese: 'ム', hiragana: 'ム', romaji: 'mu', english: 'mu' },
      { id: 'k34', japanese: 'メ', hiragana: 'メ', romaji: 'me', english: 'me' },
      { id: 'k35', japanese: 'モ', hiragana: 'モ', romaji: 'mo', english: 'mo' },
      { id: 'k36', japanese: 'ヤ', hiragana: 'ヤ', romaji: 'ya', english: 'ya' },
      { id: 'k37', japanese: 'ユ', hiragana: 'ユ', romaji: 'yu', english: 'yu' },
      { id: 'k38', japanese: 'ヨ', hiragana: 'ヨ', romaji: 'yo', english: 'yo' },
      { id: 'k39', japanese: 'ラ', hiragana: 'ラ', romaji: 'ra', english: 'ra' },
      { id: 'k40', japanese: 'リ', hiragana: 'リ', romaji: 'ri', english: 'ri' },
      { id: 'k41', japanese: 'ル', hiragana: 'ル', romaji: 'ru', english: 'ru' },
      { id: 'k42', japanese: 'レ', hiragana: 'レ', romaji: 're', english: 're' },
      { id: 'k43', japanese: 'ロ', hiragana: 'ロ', romaji: 'ro', english: 'ro' },
      { id: 'k44', japanese: 'ワ', hiragana: 'ワ', romaji: 'wa', english: 'wa' },
      { id: 'k45', japanese: 'ヲ', hiragana: 'ヲ', romaji: 'wo', english: 'wo' },
      { id: 'k46', japanese: 'ン', hiragana: 'ン', romaji: 'n', english: 'n' },
    ]
  },
  {
    id: 'jlpt_n5',
    name: 'JLPT N5 基礎單字',
    description: '奠定日檢基礎！必考的 N5 生活與基礎詞彙',
    icon: '🔰',
    items: [
      { id: 'n5_1', japanese: '行く', hiragana: 'いく', romaji: 'iku', english: 'to go' },
      { id: 'n5_2', japanese: '食べる', hiragana: 'たべる', romaji: 'taberu', english: 'to eat' },
      { id: 'n5_3', japanese: '友達', hiragana: 'ともだち', romaji: 'tomodachi', english: 'friend' },
      { id: 'n5_4', japanese: '先生', hiragana: 'せんせい', romaji: 'sensei', english: 'teacher' },
      { id: 'n5_5', japanese: '大きい', hiragana: 'おおきい', romaji: 'ookii', english: 'big' },
      { id: 'n5_6', japanese: '本', hiragana: 'ほん', romaji: 'hon', english: 'book' },
      { id: 'n5_7', japanese: '車', hiragana: 'くるま', romaji: 'kuruma', english: 'car' },
      { id: 'n5_8', japanese: '飲む', hiragana: 'のむ', romaji: 'nomu', english: 'to drink' },
    ]
  },
  {
    id: 'jlpt_n4',
    name: 'JLPT N4 核心衝刺',
    description: '7月考檢定必讀！N4 核心關鍵動詞與形容詞',
    icon: '🎯',
    items: [
      { id: 'n4_1', japanese: '準備', hiragana: 'じゅんび', romaji: 'junbi', english: 'preparation' },
      { id: 'n4_2', japanese: '試験', hiragana: 'しけん', romaji: 'shiken', english: 'exam' },
      { id: 'n4_3', japanese: '簡単', hiragana: 'かんたん', romaji: 'kantan', english: 'simple / easy' },
      { id: 'n4_4', japanese: '始める', hiragana: 'はじめる', romaji: 'hajimeru', english: 'to start' },
      { id: 'n4_5', japanese: '集める', hiragana: 'あつめる', romaji: 'atsumeru', english: 'to collect' },
      { id: 'n4_6', japanese: '思う', hiragana: 'おもう', romaji: 'omou', english: 'to think' },
      { id: 'n4_7', japanese: '安全', hiragana: 'あんぜん', romaji: 'anzen', english: 'safe' },
      { id: 'n4_8', japanese: '注意', hiragana: 'ちゅうい', romaji: 'chuui', english: 'caution / warning' },
      { id: 'n4_9', japanese: '送る', hiragana: 'おくる', romaji: 'okuru', english: 'to send' },
    ]
  },
  {
    id: 'jlpt_n3',
    name: 'JLPT N3 進階挑戰',
    description: '向上跨越！挑戰中級 N3 難度的常用重點單字',
    icon: '🏆',
    items: [
      { id: 'n3_1', japanese: '合格', hiragana: 'ごうかく', romaji: 'goukaku', english: 'to pass (exam)' },
      { id: 'n3_2', japanese: '連絡', hiragana: 'れんらく', romaji: 'renraku', english: 'contact' },
      { id: 'n3_3', japanese: '練習', hiragana: 'れんしゅう', romaji: 'renshuu', english: 'to practice' },
      { id: 'n3_4', japanese: '経済', hiragana: 'けいざい', romaji: 'keizai', english: 'economy' },
      { id: 'n3_5', japanese: '複雑', hiragana: 'ふくざつ', romaji: 'fukuzatsu', english: 'complicated' },
      { id: 'n3_6', japanese: '発表', hiragana: 'はっぴょう', romaji: 'happyou', english: 'announcement' },
      { id: 'n3_7', japanese: '緊張', hiragana: 'きんちょう', romaji: 'kinchou', english: 'nervousness' },
      { id: 'n3_8', japanese: '完成', hiragana: 'かんせい', romaji: 'kansei', english: 'completion' },
    ]
  }
];

// Sound Effects Synthesizer using Web Audio API
class SoundFX {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playCorrect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Double chime (perfect matching/correct)
    const now = this.ctx.currentTime;
    const playTone = (freq: number, startDelay: number, dur: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startDelay);
      
      gain.gain.setValueAtTime(0.0, now + startDelay);
      gain.gain.linearRampToValueAtTime(0.12, now + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + dur);

      osc.start(now + startDelay);
      osc.stop(now + startDelay + dur);
    };

    playTone(523.25, 0, 0.15); // C5
    playTone(659.25, 0.08, 0.25); // E5
  }

  playIncorrect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Low buzz
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playPop() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Fast popping sine bubble sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playVictory() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50]; // Ascending C Major
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + idx * 0.05;
      gain.gain.setValueAtTime(0.0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }
}

const sfx = new SoundFX();

// Native Text-to-Speech Pronunciation
const speakJapanese = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speeches
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Slightly slower for clear learning
    
    // Attempt to find a native Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};

// Main Component
interface JapaneseGameProps {
  onBackToMenu: () => void;
}

type GameMode = 'select_mode' | 'kana_match' | 'word_quiz' | 'kana_typer';

export function JapaneseGame({ onBackToMenu }: JapaneseGameProps) {
  const [activeMode, setActiveMode] = useState<GameMode>('select_mode');
  const [soundMuted, setSoundMuted] = useState(false);
  const [highScore, setHighScore] = useState({ match: 0, quiz: 0, typer: 0 });

  // Init voice listing on component load to ensure voices preload
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const toggleMuted = () => {
    sfx.muted = !soundMuted;
    setSoundMuted(!soundMuted);
    sfx.playClick();
  };

  const handleBackToModeSelect = () => {
    sfx.playClick();
    setActiveMode('select_mode');
  };

  return (
    <div className="game-container">
      {/* Header */}
      <header style={{ position: 'relative', width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button 
          className="action-btn back-menu-btn" 
          onClick={() => { sfx.playClick(); onBackToMenu(); }}
          style={{ position: 'absolute', left: 0 }}
        >
          🏠 返回主選單
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 className="logo-text">日語單字達人</h1>
          <div className="logo-subtext">Japanese Word Master</div>
        </div>
        <button 
          className={`sound-toggle-btn ${soundMuted ? 'muted' : ''}`}
          onClick={toggleMuted}
          style={{ position: 'absolute', right: 0 }}
          title="切換音效"
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>
      </header>

      {/* Main Panel */}
      <main className="game-arena" style={{ marginTop: '1.5rem', display: 'block', maxWidth: '900px' }}>
        {activeMode === 'select_mode' && (
          <ModeSelection 
            onSelectMode={(mode) => { sfx.playClick(); setActiveMode(mode); }} 
            highScores={highScore}
          />
        )}
        {activeMode === 'kana_match' && (
          <KanaMatchGame 
            onBack={handleBackToModeSelect} 
            updateHighScore={(score) => setHighScore(prev => ({ ...prev, match: Math.max(prev.match, score) }))}
          />
        )}
        {activeMode === 'word_quiz' && (
          <WordQuizGame 
            onBack={handleBackToModeSelect}
            updateHighScore={(score) => setHighScore(prev => ({ ...prev, quiz: Math.max(prev.quiz, score) }))}
          />
        )}
        {activeMode === 'kana_typer' && (
          <KanaTyperGame 
            onBack={handleBackToModeSelect}
            updateHighScore={(score) => setHighScore(prev => ({ ...prev, typer: Math.max(prev.typer, score) }))}
          />
        )}
      </main>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: Mode Selection Screen
   ========================================================================== */
interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
  highScores: { match: number, quiz: number, typer: number };
}

function ModeSelection({ onSelectMode, highScores }: ModeSelectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)', marginBottom: '0.8rem', letterSpacing: '2px' }}>
          選擇訓練模式
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          透過卡牌配對、選擇題答題或節奏打字暴風，輕鬆記住日語五十音與生活高頻單字。配合原生語音朗讀，視覺與聽覺同步加深記憶！
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {/* Game Mode 1 */}
        <div className="glass-panel mode-card" onClick={() => onSelectMode('kana_match')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(207,168,98,0.3)' }}>🃏</div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>連連看卡牌配對</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              翻開卡牌將日文字元與其對應的讀音或英文配對。考驗您的短期記憶與視覺辨識能力！
            </p>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>最高記錄: {highScores.match} 秒內通關</span>
          </div>
        </div>

        {/* Game Mode 2 */}
        <div className="glass-panel mode-card" onClick={() => onSelectMode('word_quiz')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(207,168,98,0.3)' }}>🎓</div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>單字四選一挑戰</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              標準多選一問答。點擊卡片聆聽日語語音，累積連續答對發動 Double 得分！
            </p>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>最高紀錄: {highScores.quiz} 分</span>
          </div>
        </div>

        {/* Game Mode 3 */}
        <div className="glass-panel mode-card" onClick={() => onSelectMode('kana_typer')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(207,168,98,0.3)' }}>⌨️</div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 700 }}>打字暴風挑戰</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              日語單字氣泡從天空緩緩降落，快速輸入其對應的拼音 Romaji 擊碎氣泡，考驗你的極速反應！
            </p>
          </div>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>最高紀錄: {highScores.typer} 分</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: Game Mode 1: Kana Match (連連看)
   ========================================================================== */
interface Card {
  id: string; // Unique instance id
  vocabId: string;
  content: string;
  type: 'jp' | 'romaji';
  isFlipped: boolean;
  isMatched: boolean;
}

function KanaMatchGame({ onBack, updateHighScore }: { onBack: () => void, updateHighScore: (score: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [firstSelected, setFirstSelected] = useState<number | null>(null);
  const [secondSelected, setSecondSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isGameOver]);

  const startGame = (cat: Category) => {
    sfx.playClick();
    setSelectedCategory(cat);
    
    // Pick at most 6 random items to keep matching board focused and clean
    const shuffledItems = [...cat.items].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledItems.slice(0, 6);

    const generatedCards: Card[] = [];
    selectedItems.forEach((item, index) => {
      generatedCards.push({
        id: `jp-${index}`,
        vocabId: item.id,
        content: item.japanese,
        type: 'jp',
        isFlipped: false,
        isMatched: false
      });
      generatedCards.push({
        id: `romaji-${index}`,
        vocabId: item.id,
        content: item.romaji,
        type: 'romaji',
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    generatedCards.sort(() => 0.5 - Math.random());
    setCards(generatedCards);
    setFirstSelected(null);
    setSecondSelected(null);
    setMoves(0);
    setTimer(0);
    setIsGameOver(false);
    setIsRunning(true);
  };

  const handleCardClick = (idx: number) => {
    if (cards[idx].isFlipped || cards[idx].isMatched || secondSelected !== null) return;

    sfx.playClick();

    // If JP card, speak it!
    if (cards[idx].type === 'jp') {
      speakJapanese(cards[idx].content);
    } else {
      // Find corresponding JP text for the romaji and pronounce it
      const matchItem = selectedCategory?.items.find(i => i.romaji === cards[idx].content);
      if (matchItem) speakJapanese(matchItem.japanese);
    }

    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    if (firstSelected === null) {
      setFirstSelected(idx);
    } else {
      setSecondSelected(idx);
      setMoves(prev => prev + 1);

      // Check Match
      const cardA = cards[firstSelected];
      const cardB = newCards[idx];

      if (cardA.vocabId === cardB.vocabId) {
        // MATCH!
        setTimeout(() => {
          sfx.playCorrect();
          setCards(prev => {
            const temp = [...prev];
            temp[firstSelected].isMatched = true;
            temp[idx].isMatched = true;
            
            // Check win
            const allMatched = temp.every(c => c.isMatched);
            if (allMatched) {
              setIsGameOver(true);
              sfx.playVictory();
              updateHighScore(timer + 1);
            }
            return temp;
          });
          setFirstSelected(null);
          setSecondSelected(null);
        }, 500);
      } else {
        // MISMATCH!
        setTimeout(() => {
          sfx.playIncorrect();
          setCards(prev => {
            const temp = [...prev];
            temp[firstSelected].isFlipped = false;
            temp[idx].isFlipped = false;
            return temp;
          });
          setFirstSelected(null);
          setSecondSelected(null);
        }, 1000);
      }
    }
  };

  if (!selectedCategory) {
    return (
      <div style={{ width: '100%' }}>
        <CategorySelector 
          title="連連看卡牌配對 - 選擇題庫" 
          onSelect={startGame} 
          onBack={onBack}
        />
      </div>
    );
  }

  const matchedPairs = cards.filter(c => c.isMatched).length / 2;
  const progressPercent = (matchedPairs / 6) * 100;

  return (
    <div className="glass-panel" style={{ width: '100%', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.4rem' }}>{selectedCategory.name}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>已配對: {matchedPairs} / 6 組</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem' }}>
          <div>⏱️ 耗時: <span style={{ color: '#fff', fontWeight: 'bold' }}>{timer} 秒</span></div>
          <div>🔄 翻牌: <span style={{ color: '#fff', fontWeight: 'bold' }}>{moves} 次</span></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-gold) 0%, #ffffff 100%)', transition: 'width 0.3s ease' }} />
      </div>

      {isGameOver ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>恭喜通關！</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            你成功在 <strong style={{ color: '#fff' }}>{timer} 秒</strong> 內完成了所有配對，翻牌次數為 <strong style={{ color: '#fff' }}>{moves} 次</strong>！
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="action-btn" onClick={() => startGame(selectedCategory)}>🔄 再玩一次</button>
            <button className="action-btn" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedCategory(null)}>📁 選擇其他題庫</button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {cards.map((card, idx) => {
            const isSelected = firstSelected === idx || secondSelected === idx;
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: '110px',
                  perspective: '1000px',
                  cursor: card.isMatched ? 'default' : 'pointer'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.4s ease',
                  transformStyle: 'preserve-3d',
                  transform: (card.isFlipped || card.isMatched) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  border: card.isMatched 
                    ? '2px solid rgba(46, 204, 113, 0.4)' 
                    : isSelected 
                      ? '2px solid var(--accent-gold)' 
                      : '1px solid rgba(255,255,255,0.1)'
                }}>
                  {/* Card Front (Japanese/Romaji Text showing) */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: card.isMatched ? 'rgba(46, 204, 113, 0.15)' : 'rgba(26, 34, 46, 0.9)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: 'rotateY(180deg)',
                    color: card.isMatched ? '#2ecc71' : 'var(--text-main)'
                  }}>
                    <span style={{ 
                      fontSize: card.content.length > 5 ? '1.1rem' : '2rem', 
                      fontWeight: 'bold',
                      fontFamily: card.type === 'jp' ? "'Noto Sans TC', sans-serif" : 'inherit'
                    }}>
                      {card.content}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px', textTransform: 'uppercase' }}>
                      {card.type === 'jp' ? '日語' : '發音'}
                    </span>
                  </div>

                  {/* Card Back (Hidden) */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'radial-gradient(circle, #1a2432 0%, #0d131a 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', opacity: 0.6 }}>🌸</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: Game Mode 2: Word Quiz (單字選擇題)
   ========================================================================== */
function WordQuizGame({ onBack, updateHighScore }: { onBack: () => void, updateHighScore: (score: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [curQIdx, setCurQIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (cat: Category) => {
    sfx.playClick();
    setSelectedCategory(cat);
    
    let selectedQ: VocabItem[] = [];
    if (cat.id === 'katakana_basic') {
      // 100 consecutive questions randomly selected, perfectly covering all 46 characters.
      const allKatakana = [...cat.items];
      // Shuffle standard set to make sure initial coverage order is randomized
      const set1 = [...allKatakana].sort(() => 0.5 - Math.random());
      const set2 = [...allKatakana].sort(() => 0.5 - Math.random());
      
      // We need 100 items. Currently 46 + 46 = 92 items. We need 8 more.
      const extraCount = 100 - (allKatakana.length * 2); // 8
      const extraItems = [...allKatakana].sort(() => 0.5 - Math.random()).slice(0, extraCount);
      
      const combined = [...set1, ...set2, ...extraItems];
      // Final shuffle of the entire 100-item array
      selectedQ = combined.sort(() => 0.5 - Math.random());
    } else {
      // Standard behavior: Shuffle and pick 10 words
      const shuffled = [...cat.items].sort(() => 0.5 - Math.random());
      selectedQ = shuffled.slice(0, 10);
    }
    
    setQuestions(selectedQ);
    setCurQIdx(0);
    setSelectedAns(null);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
    generateOptionsForQuestion(selectedQ[0], cat.items);
  };

  const generateOptionsForQuestion = (q: VocabItem, allItems: VocabItem[]) => {
    // Correct option
    const opts = [q.english];
    
    // Pick 3 random wrong options
    const wrongPool = allItems.filter(item => item.id !== q.id).map(item => item.english);
    const shuffledWrong = wrongPool.sort(() => 0.5 - Math.random());
    
    shuffledWrong.slice(0, 3).forEach(o => opts.push(o));
    
    // Shuffle all 4 options
    opts.sort(() => 0.5 - Math.random());
    setOptions(opts);
  };

  const handleOptionClick = (opt: string) => {
    if (selectedAns !== null) return;
    
    setSelectedAns(opt);
    const correctAns = questions[curQIdx].english;
    const isCorrect = opt === correctAns;

    if (isCorrect) {
      sfx.playCorrect();
      const currentStreak = streak + 1;
      setStreak(currentStreak);
      
      // Streak Multiplier: +10 base, +5 bonus per streak (capped at +30 total)
      const points = 10 + Math.min(30, (currentStreak - 1) * 5);
      setScore(prev => prev + points);
      
      setTimeout(() => {
        advanceQuestion();
      }, 1200);
    } else {
      sfx.playIncorrect();
      setStreak(0);
      
      setTimeout(() => {
        advanceQuestion();
      }, 2000);
    }
  };

  const advanceQuestion = () => {
    setSelectedAns(null);
    if (curQIdx + 1 < questions.length) {
      const nextIdx = curQIdx + 1;
      setCurQIdx(nextIdx);
      generateOptionsForQuestion(questions[nextIdx], selectedCategory!.items);
    } else {
      setQuizFinished(true);
      sfx.playVictory();
      updateHighScore(score);
    }
  };

  const speakCurrentWord = () => {
    if (questions[curQIdx]) {
      speakJapanese(questions[curQIdx].japanese);
    }
  };

  useEffect(() => {
    if (selectedCategory && questions.length > 0 && curQIdx < questions.length && selectedAns === null) {
      // Auto speak word when loaded
      speakCurrentWord();
    }
  }, [curQIdx, questions, selectedCategory]);

  if (!selectedCategory) {
    return (
      <div style={{ width: '100%' }}>
        <CategorySelector 
          title="單字四選一挑戰 - 選擇題庫" 
          onSelect={startQuiz} 
          onBack={onBack}
        />
      </div>
    );
  }

  const currentQ = questions[curQIdx];
  const totalQ = questions.length;
  const progressPercent = ((curQIdx) / totalQ) * 100;

  return (
    <div className="glass-panel" style={{ width: '100%', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.4rem' }}>{selectedCategory.name}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>題目: {curQIdx + 1} / {totalQ}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1.05rem', alignItems: 'center' }}>
          {streak > 1 && (
            <div style={{ animation: 'pulse 1s infinite', color: '#ff9f43', fontWeight: 'bold' }}>
              🔥 連擊: {streak}
            </div>
          )}
          <div>得分: <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{score}</span></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '2.5rem', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-gold) 0%, #ffffff 100%)', transition: 'width 0.3s ease' }} />
      </div>

      {quizFinished ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
          <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>挑戰結束！</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            您的最終得分為: <strong style={{ color: '#fff', fontSize: '1.8rem' }}>{score} 分</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            正確率: {Math.round((score / (totalQ * 10)) * 100)}%
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="action-btn" onClick={() => startQuiz(selectedCategory)}>🔄 再戰一局</button>
            <button className="action-btn" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedCategory(null)}>📁 選擇其他題庫</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          
          {/* Main Flashcard */}
          <div 
            onClick={speakCurrentWord}
            style={{
              background: 'radial-gradient(circle, #1a2536 0%, #0c1421 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '2.5rem 4rem',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              transition: 'transform 0.2s',
            }}
            className="quiz-card-hover"
          >
            <span style={{ fontSize: '3.8rem', fontWeight: 900, color: '#fff', letterSpacing: '2px' }}>
              {currentQ.japanese}
            </span>
            {selectedAns !== null && (
              <span style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 500 }}>
                {currentQ.romaji}
              </span>
            )}
            <button 
              style={{
                background: 'rgba(257, 168, 98, 0.1)',
                border: '1px solid rgba(207, 168, 98, 0.3)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                color: 'var(--accent-gold)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '0.5rem'
              }}
            >
              🔊 聆聽發音
            </button>
          </div>

          {/* Options Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.2rem',
            width: '100%',
            maxWidth: '650px',
            marginTop: '1rem'
          }}>
            {options.map((opt) => {
              const isSelected = selectedAns === opt;
              const isCorrectOpt = opt === currentQ.english;
              
              let cardBg = 'rgba(255,255,255,0.03)';
              let borderStyle = '1px solid rgba(255,255,255,0.1)';
              let textColor = 'var(--text-main)';

              if (selectedAns !== null) {
                if (isCorrectOpt) {
                  cardBg = 'rgba(46, 204, 113, 0.15)';
                  borderStyle = '2px solid #2ecc71';
                  textColor = '#2ecc71';
                } else if (isSelected) {
                  cardBg = 'rgba(231, 76, 60, 0.15)';
                  borderStyle = '2px solid #e74c3c';
                  textColor = '#e74c3c';
                } else {
                  borderStyle = '1px solid rgba(255,255,255,0.02)';
                  textColor = 'rgba(255,255,255,0.3)';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  disabled={selectedAns !== null}
                  style={{
                    background: cardBg,
                    border: borderStyle,
                    color: textColor,
                    padding: '1.2rem 1.5rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    cursor: selectedAns !== null ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  className={selectedAns === null ? 'option-btn-hover' : ''}
                >
                  <span>{opt}</span>
                  {selectedAns !== null && isCorrectOpt && <span>✅</span>}
                  {selectedAns !== null && isSelected && !isCorrectOpt && <span>❌</span>}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: Game Mode 3: Kana Typer (打字暴風)
   ========================================================================== */
interface FallingWord {
  id: string;
  item: VocabItem;
  x: number; // Percent of width (e.g. 5 to 85)
  y: number; // Pixels from top
  speed: number;
}

function KanaTyperGame({ onBack, updateHighScore }: { onBack: () => void, updateHighScore: (score: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [combo, setCombo] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<FallingWord[]>([]);
  wordsRef.current = fallingWords;

  // Frame Loop & Word Spawning
  useEffect(() => {
    if (!gameStarted || gameOver || !selectedCategory) return;

    // Game loop running at 60fps
    let lastTime = Date.now();
    const gameLoop = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Update positions
      setFallingWords(prev => {
        const next: FallingWord[] = [];
        let lifeLostCount = 0;
        
        prev.forEach(w => {
          const newY = w.y + w.speed * delta;
          // Trigger life lost if goes past bottom (85% of screen height)
          if (newY > 400) {
            lifeLostCount++;
          } else {
            next.push({ ...w, y: newY });
          }
        });

        if (lifeLostCount > 0) {
          sfx.playIncorrect();
          setCombo(0);
          setLives(l => {
            const nextL = l - lifeLostCount;
            if (nextL <= 0) {
              setGameOver(true);
              sfx.playVictory(); // Finale
            }
            return Math.max(0, nextL);
          });
        }
        return next;
      });
    }, 16);

    // Spawning words interval
    // Spawns faster as score increases
    const spawnTimer = setInterval(() => {
      const items = selectedCategory.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      const newWord: FallingWord = {
        id: `word-${Date.now()}-${Math.random()}`,
        item: randomItem,
        x: 10 + Math.random() * 70, // 10% to 80% width
        y: 0,
        speed: 35 + Math.min(60, score * 0.25) // Speed increases with score
      };

      setFallingWords(prev => [...prev, newWord]);
    }, Math.max(1200, 3000 - score * 10));

    return () => {
      clearInterval(gameLoop);
      clearInterval(spawnTimer);
    };
  }, [gameStarted, gameOver, selectedCategory, score]);

  const initTyperGame = (cat: Category) => {
    sfx.playClick();
    setSelectedCategory(cat);
    setFallingWords([]);
    setInputValue('');
    setScore(0);
    setLives(5);
    setCombo(0);
    setGameOver(false);
    setGameStarted(true);
  };

  // Process input change (instant match checks feel highly responsive!)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim().toLowerCase();
    setInputValue(e.target.value);

    // Check if typed romaji matches any word
    const matchedIdx = wordsRef.current.findIndex(
      w => w.item.romaji.toLowerCase() === text
    );

    if (matchedIdx !== -1) {
      // Find the matched word
      const matched = wordsRef.current[matchedIdx];
      
      // Pop Sound!
      sfx.playPop();
      speakJapanese(matched.item.japanese);

      // Score computations
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 10 * (1 + Math.floor(newCombo / 5)); // Combo bonus!
      setScore(prev => {
        const nextScore = prev + points;
        updateHighScore(nextScore);
        return nextScore;
      });

      // Remove from list
      setFallingWords(prev => prev.filter(w => w.id !== matched.id));
      setInputValue('');
    }
  };

  if (!selectedCategory) {
    return (
      <div style={{ width: '100%' }}>
        <CategorySelector 
          title="打字暴風 - 選擇題庫" 
          onSelect={initTyperGame} 
          onBack={onBack}
        />
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ width: '100%', padding: '2rem' }}>
      {/* Game HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.4rem' }}>{selectedCategory.name}</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx} style={{ opacity: idx < lives ? 1 : 0.2, fontSize: '1.1rem' }}>❤️</span>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1.05rem', alignItems: 'center' }}>
          {combo > 2 && (
            <div style={{ color: '#00d2d3', fontWeight: 'bold', textShadow: '0 0 10px rgba(0,210,211,0.5)' }}>
              🔥 Combo: {combo}
            </div>
          )}
          <div>得分: <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.3rem' }}>{score}</span></div>
        </div>
      </div>

      {/* Falling Game Arena */}
      <div 
        ref={gameAreaRef}
        style={{
          height: '400px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {!gameStarted && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>⌨️</span>
            <button className="action-btn" onClick={() => setGameStarted(true)}>▶️ 開始打字暴風</button>
          </div>
        )}

        {gameStarted && gameOver && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '1rem', zIndex: 10, position: 'absolute', width: '100%', background: 'rgba(10, 13, 19, 0.9)' }}>
            <span style={{ fontSize: '4rem' }}>💥 Game Over</span>
            <p style={{ color: 'var(--text-muted)' }}>最終得分: <strong style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }}>{score} 分</strong></p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="action-btn" onClick={() => initTyperGame(selectedCategory)}>🔄 重新挑戰</button>
              <button className="action-btn" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedCategory(null)}>📁 換個題庫</button>
            </div>
          </div>
        )}

        {/* Falling Word Elements */}
        {gameStarted && !gameOver && fallingWords.map((word) => (
          <div
            key={word.id}
            style={{
              position: 'absolute',
              left: `${word.x}%`,
              top: `${word.y}px`,
              background: 'rgba(26, 34, 46, 0.85)',
              border: '1px solid rgba(207, 168, 98, 0.3)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.1s linear',
              pointerEvents: 'none',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{word.item.japanese}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{word.item.english}</span>
          </div>
        ))}
      </div>

      {/* User Input Bar */}
      {gameStarted && !gameOver && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="請輸入日語單字的對應 Romaji 拼音..."
            autoFocus
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(207, 168, 98, 0.4)',
              borderRadius: '8px',
              padding: '0.8rem 1.2rem',
              fontSize: '1.1rem',
              color: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setInputValue('');
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENT: Category Selector (用於選擇不同單字題庫)
   ========================================================================== */
interface CategorySelectorProps {
  title: string;
  onSelect: (cat: Category) => void;
  onBack: () => void;
}

function CategorySelector({ title, onSelect, onBack }: CategorySelectorProps) {
  return (
    <div className="glass-panel" style={{ width: '100%', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <button 
          className="action-btn" 
          onClick={onBack}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          ⬅️ 返回模式選擇
        </button>
        <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.4rem' }}>{title}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        {VOCAB_DATABASE.map((cat) => (
          <div 
            key={cat.id} 
            className="glass-panel option-btn-hover"
            onClick={() => onSelect(cat)}
            style={{
              padding: '1.25rem',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.03)', width: '60px', height: '60px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cat.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>{cat.name}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
