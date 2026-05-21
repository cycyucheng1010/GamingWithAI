import React, { useEffect, useState, useRef } from 'react';
import { useGomoku } from '../hooks/useGomoku';

// Synthesizer Audio Engine using Web Audio API
class AudioEngine {
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

  playPlaceStone() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.045);

    const bufferSize = this.ctx.sampleRate * 0.006;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2500;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.006);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start();
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
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  playWin() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0.0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }
}

const audio = new AudioEngine();

interface GomokuGameProps {
  onBackToMenu: () => void;
}

export function GomokuGame({ onBackToMenu }: GomokuGameProps) {
  const {
    board,
    turn,
    winner,
    winningLine,
    lastMove,
    placeStone,
    undo,
    resetGame,
    moveCount,
  } = useGomoku();

  const [soundMuted, setSoundMuted] = useState(false);
  const [wins, setWins] = useState({ black: 0, white: 0 });
  const [moveLogs, setMoveLogs] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const toggleMuted = () => {
    audio.muted = !soundMuted;
    setSoundMuted(!soundMuted);
    audio.playClick();
  };

  useEffect(() => {
    if (winner !== null) {
      if (winner === 0) {
        setMoveLogs((prev) => [...prev, '對局結束：和局']);
      } else {
        const playerLabel = winner === 1 ? '黑子 (Player 1)' : '白子 (Player 2)';
        setMoveLogs((prev) => [...prev, `對局結束：${playerLabel} 獲勝！`]);
        audio.playWin();

        setWins((prev) => {
          if (winner === 1) return { ...prev, black: prev.black + 1 };
          return { ...prev, white: prev.white + 1 };
        });
      }
    }
  }, [winner]);

  const handleCellClick = (r: number, c: number) => {
    if (winner !== null || board[r][c] !== 0) return;

    audio.playPlaceStone();

    const colLetter = String.fromCharCode(65 + c);
    const rowNum = 15 - r;
    const playerLabel = turn === 1 ? '黑子' : '白子';
    setMoveLogs((prev) => [...prev, `${playerLabel}：${colLetter}${rowNum}`]);

    placeStone(r, c);
  };

  const handleUndo = () => {
    audio.playClick();
    if (moveLogs.length > 0) {
      setMoveLogs((prev) => prev.slice(0, prev.length - 1));
    }
    undo();
  };

  const handleReset = () => {
    audio.playClick();
    setMoveLogs([]);
    resetGame();
  };

  const isStarPoint = (r: number, c: number): boolean => {
    const spots = [3, 7, 11];
    return spots.includes(r) && spots.includes(c) && !(r !== 7 && c === 7) && !(r === 7 && c !== 7);
  };

  const renderWinningLineOverlay = () => {
    if (!winningLine || winningLine.length < 5) return null;

    const start = winningLine[0];
    const end = winningLine[winningLine.length - 1];
    const getPercent = (coord: number) => ((coord + 0.5) * 100) / 15;

    const x1 = `${getPercent(start[1])}%`;
    const y1 = `${getPercent(start[0])}%`;
    const x2 = `${getPercent(end[1])}%`;
    const y2 = `${getPercent(end[0])}%`;

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 14,
        }}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--accent-gold)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))"
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: 'dash 0.5s ease-out forwards',
          }}
        />
        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </svg>
    );
  };

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      const stoneVal = board[r][c];
      const isOccupied = stoneVal !== 0;
      const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
      const isWinStone = winningLine?.some(([wr, wc]) => wr === r && wc === c) || false;

      cells.push(
        <div
          key={`${r}-${c}`}
          className="board-cell"
          data-row={r}
          data-col={c}
        >
          {isStarPoint(r, c) && <div className="star-dot" />}
          <div
            className="cell-hitbox"
            onClick={() => handleCellClick(r, c)}
          />
          {isOccupied && (
            <div
              className={`stone player-${stoneVal} ${isWinStone ? 'winning-glow' : ''}`}
            />
          )}
          {isOccupied && isLast && <div className="last-move-indicator" />}
        </div>
      );
    }
  }

  return (
    <div className="game-container">
      <header style={{ position: 'relative', width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button 
          className="action-btn back-menu-btn" 
          onClick={() => { audio.playClick(); onBackToMenu(); }}
          style={{ position: 'absolute', left: 0 }}
        >
          🏠 返回主選單
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 className="logo-text">Gomoku Arena</h1>
          <div className="logo-subtext">Tactical Five-in-a-Row</div>
        </div>
      </header>

      <main className="game-arena" style={{ marginTop: '1rem' }}>
        {/* Left side: HUD Control Panel */}
        <section className="glass-panel controls-section">
          <div>
            <div className="section-title">
              <span>對局資訊</span>
              <button
                className={`sound-toggle-btn ${soundMuted ? 'muted' : ''}`}
                onClick={toggleMuted}
                aria-label="Toggle Sound"
                title="切換音效"
              >
                {soundMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>

          <div
            className={`status-banner ${
              winner !== null
                ? winner === 0
                  ? 'draw'
                  : `winner-${winner}`
                : ''
            }`}
          >
            <div className="status-message">
              {winner !== null ? (
                winner === 0 ? (
                  <span>🤝 對局結果：和局 (Draw)</span>
                ) : (
                  <>
                    <div className={`turn-dot ${winner === 2 ? 'white' : 'black'}`} />
                    <span>對局結果：{winner === 1 ? '黑子獲勝' : '白子獲勝'}！</span>
                  </>
                )
              ) : (
                <>
                  <div className={`turn-dot ${turn === 2 ? 'white' : 'black'}`} />
                  <span>目前回合：{turn === 1 ? '黑子 (先手)' : '白子 (後手)'}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="section-title">累積勝場紀錄</div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label-with-icon">
                  <div className="small-stone-indicator black" />
                  <span>黑子 (先手)</span>
                </div>
                <div className="stat-val gold-text">{wins.black}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label-with-icon">
                  <div className="small-stone-indicator white" />
                  <span>白子 (後手)</span>
                </div>
                <div className="stat-val gold-text">{wins.white}</div>
              </div>
            </div>

            <div className="stats-grid" style={{ marginTop: '0.75rem' }}>
              <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                <span className="setting-label">總下子數</span>
                <div className="stat-val" style={{ color: '#ffffff' }}>{moveCount}</div>
              </div>
            </div>
          </div>

          <div className="btn-group-vertical" style={{ marginTop: '0.5rem' }}>
            <button
              className="action-btn"
              onClick={handleUndo}
              disabled={moveCount === 0 || winner !== null}
            >
              ⏪ 回退一手 (Undo)
            </button>
            <button className="action-btn btn-reset" onClick={handleReset}>
              🔄 重新開局 (Reset)
            </button>
          </div>

          <div>
            <div className="section-title">落子記錄</div>
            <div className="movelog-panel">
              <div className="movelog-title">對局記錄流</div>
              {moveLogs.length === 0 ? (
                <div style={{ fontStyle: 'italic', opacity: 0.5, fontSize: '0.9rem' }}>
                  等待落子...
                </div>
              ) : (
                <div className="movelog-list">
                  {moveLogs.map((log, idx) => (
                    <div key={idx} className="movelog-item">
                      <span style={{ color: 'var(--accent-gold)', opacity: 0.6 }}>[{idx + 1}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right side: Traditional Wood Grid Board */}
        <section className="glass-panel board-panel">
          <div className="board-wrapper" ref={boardRef}>
            <div className="gomoku-grid">
              {cells}
              {renderWinningLineOverlay()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
