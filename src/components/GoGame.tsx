import { useEffect, useState, useRef, useMemo } from 'react';
import { useGo, type ScoreDetails } from '../hooks/useGo';

// Premium Go Audio Synthesizer Engine using Web Audio API
class GoAudioEngine {
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

    // Synthesize the natural crisp clattering sound of a slate/shell stone on a wood board
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.055);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.055);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.055);

    // Add wooden impact noise crackle
    const bufferSize = this.ctx.sampleRate * 0.008;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2200;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.008);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start();
  }

  playCapture() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Synthesize a sweeping chime sound when stones are swept away
    const now = this.ctx.currentTime;
    const playTone = (freq: number, startDelay: number, dur: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + startDelay);
      
      gain.gain.setValueAtTime(0.0, now + startDelay);
      gain.gain.linearRampToValueAtTime(0.12, now + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + dur);

      osc.start(now + startDelay);
      osc.stop(now + startDelay + dur);
    };

    playTone(659.25, 0, 0.15); // E5
    playTone(880.00, 0.06, 0.2); // A5
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
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  playPass() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Soft deep resonant whoosh / gong-like sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playWin() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Standard majestic Japanese pentatonic scale sound
    const notes = [440.00, 493.88, 523.25, 659.25, 783.99, 880.00, 987.77, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + idx * 0.07;
      gain.gain.setValueAtTime(0.0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }
}

const audio = new GoAudioEngine();

// Check if cell is a hoshi (star) point
function isHoshiPoint(r: number, c: number, size: number): boolean {
  if (size === 19) {
    const points = [3, 9, 15];
    return points.includes(r) && points.includes(c);
  }
  if (size === 13) {
    if (r === 6 && c === 6) return true;
    return (r === 3 || r === 9) && (c === 3 || c === 9);
  }
  if (size === 9) {
    if (r === 4 && c === 4) return true;
    return (r === 2 || r === 6) && (c === 2 || c === 6);
  }
  return false;
}

// Territory flood-fill helper for live HUD visualization
function calculateTerritories(board: number[][], size: number) {
  const territory = Array(size).fill(null).map(() => Array(size).fill(0)); // 0=none, 1=black, 2=white
  const visited = Array(size).fill(null).map(() => Array(size).fill(false));

  const getAdjacents = (r: number, c: number) => {
    const adj = [];
    if (r > 0) adj.push({ r: r - 1, c });
    if (r < size - 1) adj.push({ r: r + 1, c });
    if (c > 0) adj.push({ r, c: c - 1 });
    if (c < size - 1) adj.push({ r, c: c + 1 });
    return adj;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0 && !visited[r][c]) {
        const region: { r: number; c: number }[] = [];
        const queue = [{ r, c }];
        visited[r][c] = true;
        const adjacentColors = new Set<number>();

        while (queue.length > 0) {
          const curr = queue.shift()!;
          region.push(curr);

          const adjacents = getAdjacents(curr.r, curr.c);
          adjacents.forEach(adj => {
            const adjColor = board[adj.r][adj.c];
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

        let owner = 0;
        if (adjacentColors.has(1) && !adjacentColors.has(2)) {
          owner = 1;
        } else if (adjacentColors.has(2) && !adjacentColors.has(1)) {
          owner = 2;
        }

        if (owner !== 0) {
          region.forEach(p => {
            territory[p.r][p.c] = owner;
          });
        }
      }
    }
  }

  return territory;
}

interface GoGameProps {
  onBackToMenu: () => void;
}

export function GoGame({ onBackToMenu }: GoGameProps) {
  const [boardSize, setBoardSize] = useState(19);
  const komi = 7.5;
  const {
    board,
    turn,
    captures,
    winner,
    scoreResult,
    errorMsg,
    playStone,
    pass,
    resign,
    undo,
    resetGame,
    getScoreEstimate,
    historyLength,
  } = useGo(boardSize, komi);

  const [soundMuted, setSoundMuted] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [lastPlacements, setLastPlacements] = useState<{ r: number; c: number } | null>(null);

  // Monitor captures to trigger capture sound FX
  const prevCaptures = useRef(captures);
  useEffect(() => {
    if (
      captures.black > prevCaptures.current.black ||
      captures.white > prevCaptures.current.white
    ) {
      audio.playCapture();
    }
    prevCaptures.current = captures;
  }, [captures]);

  // Monitor winners for victory fanfares
  useEffect(() => {
    if (winner !== null) {
      audio.playWin();
    }
  }, [winner]);

  const toggleSound = () => {
    audio.muted = !soundMuted;
    setSoundMuted(!soundMuted);
    audio.playClick();
  };

  const handleCellClick = (r: number, c: number) => {
    const success = playStone(r, c);
    if (success) {
      audio.playPlaceStone();
      setLastPlacements({ r, c });
    } else {
      // Small tick showing error
      audio.playClick();
    }
  };

  const handlePass = () => {
    audio.playPass();
    pass();
  };

  const handleResign = () => {
    audio.playPass();
    resign(turn === 1 ? 'Black' : 'White');
  };

  const handleUndo = () => {
    audio.playClick();
    undo();
    setLastPlacements(null);
  };

  const handleSizeChange = (size: number) => {
    audio.playClick();
    setBoardSize(size);
    resetGame(size);
    setLastPlacements(null);
  };

  // Real-time score details derived using useMemo
  const liveEstimate: ScoreDetails = useMemo(() => {
    return getScoreEstimate();
  }, [board, boardSize, getScoreEstimate]);

  // Territory matrix for shading
  const territories = useMemo(() => {
    return calculateTerritories(board, boardSize);
  }, [board, boardSize]);

  return (
    <div className="game-container">
      {/* Header Banner */}
      <header style={{ position: 'relative', width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button 
          className="action-btn back-menu-btn" 
          onClick={() => { audio.playClick(); onBackToMenu(); }}
          style={{ position: 'absolute', left: 0 }}
        >
          🏠 返回主選單
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 className="logo-text">圍棋對弈場</h1>
          <div className="logo-subtext">Go Arena</div>
        </div>
        <button 
          className={`sound-toggle-btn ${soundMuted ? 'muted' : ''}`}
          onClick={toggleSound}
          style={{ position: 'absolute', right: 0 }}
          title="切換音效"
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>
      </header>

      {/* Main Grid Layout */}
      <main className="game-arena">
        {/* Left Side Control Panel & Stats (Glassmorphic) */}
        <section className="controls-section glass-panel">
          <div>
            <h2 className="section-title">
              <span>棋局資訊</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {boardSize}x{boardSize}
              </span>
            </h2>
            
            {/* Status Banner */}
            <div className={`status-banner ${winner ? 'draw' : ''}`}>
              <div className="status-message">
                {winner ? (
                  <>🎉 對局已結束</>
                ) : (
                  <>
                    <div className={`turn-dot ${turn === 1 ? 'black' : 'white'}`} />
                    <span>{turn === 1 ? '黑子輪放' : '白子輪放'}</span>
                  </>
                )}
              </div>
              {!winner && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  手數: {historyLength}
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div style={{
                background: 'rgba(231, 76, 60, 0.15)',
                border: '1px solid #e74c3c',
                borderRadius: '6px',
                padding: '0.6rem 0.8rem',
                color: '#ff6b6b',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                lineHeight: '1.4',
                animation: 'shake 0.4s'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>

          {/* Captured Stones Stats */}
          <div>
            <div className="section-title">提子統計</div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label-with-icon">
                  <div className="small-stone-indicator black" />
                  <span>黑棋提子</span>
                </span>
                <span className="stat-val gold-text">{captures.black}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label-with-icon">
                  <div className="small-stone-indicator white" />
                  <span>白棋提子</span>
                </span>
                <span className="stat-val">{captures.white}</span>
              </div>
            </div>
          </div>

          {/* Live Score Estimator HUD */}
          <div>
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>即時局勢估算</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', textTransform: 'none' }}>
                <input 
                  type="checkbox" 
                  checked={showEstimate} 
                  onChange={(e) => { audio.playClick(); setShowEstimate(e.target.checked); }}
                  style={{ cursor: 'pointer' }}
                />
                顯示形勢
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>黑棋估算總和: <strong style={{ color: 'var(--accent-gold)' }}>{liveEstimate.blackTotal}</strong></span>
                <span>白棋 (+{komi}): <strong style={{ color: '#fff' }}>{liveEstimate.whiteTotal}</strong></span>
              </div>
              
              {/* Ratio Bar */}
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  width: `${(liveEstimate.blackTotal / (liveEstimate.blackTotal + liveEstimate.whiteTotal || 1)) * 100}%`,
                  background: 'var(--accent-gold)',
                  transition: 'width 0.4s ease'
                }} />
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  transition: 'all 0.4s ease'
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                領先方估算：{liveEstimate.winner === 'Black' ? '黑棋' : '白棋'}領先 {liveEstimate.margin.toFixed(1)} 子
              </div>
            </div>
          </div>

          {/* Size Changer Selection */}
          <div>
            <div className="section-title">棋盤規格</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[9, 13, 19].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`action-btn ${boardSize === size ? 'btn-reset' : ''}`}
                  style={{ flex: 1, padding: '0.5rem' }}
                >
                  {size === 9 ? '9x9 快速' : size === 13 ? '13x13 進階' : '19x19 標準'}
                </button>
              ))}
            </div>
          </div>

          {/* Game Buttons Panel */}
          <div className="btn-group-vertical">
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={handlePass}
                disabled={!!winner} 
                className="action-btn"
                style={{ flex: 1 }}
                title="放棄一次落子權利"
              >
                Pass 虛手
              </button>
              <button 
                onClick={handleResign}
                disabled={!!winner}
                className="action-btn"
                style={{ flex: 1, borderColor: 'rgba(231, 76, 60, 0.4)', color: '#ff6b6b' }}
                title="向對手投降認輸"
              >
                🏳️ 認輸
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={handleUndo} 
                disabled={historyLength === 0} 
                className="action-btn"
                style={{ flex: 1 }}
              >
                ↩️ 悔棋
              </button>
              <button 
                onClick={() => { audio.playClick(); resetGame(boardSize); setLastPlacements(null); }} 
                className="action-btn btn-reset"
                style={{ flex: 1 }}
              >
                🔄 重新開局
              </button>
            </div>
          </div>
        </section>

        {/* Right Side Go Board Rendering (Wooden Board) */}
        <section className="board-panel glass-panel">
          <div className="board-wrapper">
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                gridTemplateRows: `repeat(${boardSize}, 1fr)`,
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              {board.map((rowArr, r) =>
                rowArr.map((cellState, c) => {
                  const isHoshi = isHoshiPoint(r, c, boardSize);
                  const isLastMove = lastPlacements && lastPlacements.r === r && lastPlacements.c === c;
                  const isBlackTerritory = territories[r][c] === 1;
                  const isWhiteTerritory = territories[r][c] === 2;

                  return (
                    <div 
                      key={`${r}-${c}`}
                      className="board-cell"
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{ position: 'relative' }}
                    >
                      {/* Dynamic intersection grid lines */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: colLineOffset(c, boardSize).left,
                        right: colLineOffset(c, boardSize).right,
                        height: '1px',
                        background: 'var(--grid-line)',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: rowLineOffset(r, boardSize).top,
                        bottom: rowLineOffset(r, boardSize).bottom,
                        width: '1px',
                        background: 'var(--grid-line)',
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none'
                      }} />

                      {/* Classic Solid Star Points */}
                      {isHoshi && <div className="star-dot" />}

                      {/* Transparent Hover Ghost Stone Preview */}
                      {cellState === 0 && !winner && hoveredCell?.r === r && hoveredCell?.c === c && (
                        <div 
                          className={`stone player-${turn}`}
                          style={{ opacity: 0.45 }}
                        />
                      )}

                      {/* Territoral Estimate Overlay dots */}
                      {showEstimate && cellState === 0 && (isBlackTerritory || isWhiteTerritory) && (
                        <div style={{
                          position: 'absolute',
                          width: '10px',
                          height: '10px',
                          borderRadius: '2px',
                          background: isBlackTerritory ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
                          border: isBlackTerritory ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.15)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          zIndex: 3,
                          pointerEvents: 'none'
                        }} />
                      )}

                      {/* Laid Stones on intersections */}
                      {cellState !== 0 && (
                        <div className={`stone player-${cellState}`} />
                      )}

                      {/* Last Move Red Dot Highlight */}
                      {cellState !== 0 && isLastMove && (
                        <div className="last-move-indicator" />
                      )}

                      {/* Interactable cell click trigger */}
                      <div 
                        className="cell-hitbox"
                        onClick={() => handleCellClick(r, c)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Rules / Guides Info panel below board */}
          <div style={{
            marginTop: '1.5rem',
            background: 'rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.02)',
            borderRadius: '8px',
            padding: '0.8rem 1rem',
            width: '100%',
            maxWidth: '580px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5'
          }}>
            📋 <strong>圍棋規則提示</strong>：
            <ul>
              <li><strong>提子</strong>：將對手群組的所有「氣」（鄰近空點）封鎖即可提子。</li>
              <li><strong>自殺禁著點</strong>：若落子後該群組氣為 0 且未提吃敵子，則屬自殺，禁止落子。</li>
              <li><strong>打劫/同型再現</strong>：禁止全局同型再現（Superko），防止重複局面無限循環。</li>
              <li><strong>勝負計算</strong>：雙方連續虛手（Pass）將觸發<strong>數子法（Area Scoring）</strong>自動計算地盤與棋子，貼黑 7.5 目以定勝負。</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Endgame Scoring Breakdown Dialog Card Pop-up */}
      {winner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          backdropFilter: 'blur(8px)',
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '500px',
              textAlign: 'center',
              padding: '2.5rem',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 15px 50px rgba(207, 168, 98, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🏆</div>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)', fontSize: '2rem', margin: '0 0 1rem 0' }}>
              對局宣告結束！
            </h2>

            {scoreResult ? (
              <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>
                  勝負裁決：
                  <span style={{ color: scoreResult.winner === 'Black' ? 'var(--accent-gold)' : '#fff' }}>
                    {scoreResult.winner === 'Black' ? '黑棋' : '白棋'}
                  </span>
                  獲勝 (領先 {scoreResult.margin.toFixed(1)} 子)
                </h3>

                {/* Score breakdown table */}
                <div style={{
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <span>得分項目</span>
                    <span style={{ color: 'var(--accent-gold)' }}>● 黑棋 (Black)</span>
                    <span style={{ color: '#fff' }}>○ 白棋 (White)</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.5rem 0', fontSize: '0.85rem' }}>
                    <span>棋子數 (Stones)</span>
                    <span>{scoreResult.blackStones}</span>
                    <span>{scoreResult.whiteStones}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.5rem 0', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>圍地面積 (Territory)</span>
                    <span>{scoreResult.blackTerritory}</span>
                    <span>{scoreResult.whiteTerritory}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.5rem 0', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>貼目補償 (Komi)</span>
                    <span>0</span>
                    <span>{scoreResult.komi}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', paddingTop: '0.6rem', fontWeight: 'bold', fontSize: '1rem' }}>
                    <span>計算總計 (Total)</span>
                    <span style={{ color: 'var(--accent-gold)' }}>{scoreResult.blackTotal.toFixed(1)} 子</span>
                    <span>{scoreResult.whiteTotal.toFixed(1)} 子</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ margin: '2rem 0', fontSize: '1.2rem', color: '#fff' }}>
                裁決：{winner === 'Black' ? '黑棋' : '白棋'}獲勝 (對方中盤認輸 🏳️)
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="action-btn btn-reset" 
                onClick={() => { audio.playClick(); resetGame(boardSize); setLastPlacements(null); }}
                style={{ minWidth: '130px' }}
              >
                🔄 再開一局
              </button>
              <button 
                className="action-btn" 
                onClick={() => { audio.playClick(); resetGame(boardSize); setLastPlacements(null); onBackToMenu(); }}
                style={{ background: 'rgba(255,255,255,0.05)', minWidth: '130px' }}
              >
                🏠 返回主頁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers for clipping cell grid border lines dynamically
function colLineOffset(c: number, size: number) {
  return {
    left: c === 0 ? '50%' : '0',
    right: c === size - 1 ? '50%' : '0'
  };
}

function rowLineOffset(r: number, size: number) {
  return {
    top: r === 0 ? '50%' : '0',
    bottom: r === size - 1 ? '50%' : '0'
  };
}
