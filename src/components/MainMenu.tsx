

interface MainMenuProps {
  onSelectGame: (game: 'gomoku' | 'japanese' | 'go') => void;
}

export function MainMenu({ onSelectGame }: MainMenuProps) {
  return (
    <div className="game-container" style={{ justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <h1 className="logo-text" style={{ fontSize: '3rem', letterSpacing: '6px' }}>
          Gameing with AI
        </h1>
        <div className="logo-subtext" style={{ letterSpacing: '10px' }}>
          Interactive Game Center
        </div>
      </header>

      <main 
        style={{ 
          width: '100%', 
          maxWidth: '850px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '2.5rem',
          zIndex: 1
        }}
      >
        {/* Game 1 Card: Gomoku Arena */}
        <div 
          className="glass-panel main-menu-card" 
          onClick={() => onSelectGame('gomoku')}
          style={{ 
            cursor: 'pointer',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Glowing Circle */}
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(207, 168, 98, 0.15) 0%, transparent 70%)',
            top: '-20px',
            right: '-20px',
            borderRadius: '50%'
          }} />

          <div style={{ 
            fontSize: '4.5rem', 
            background: 'rgba(255,255,255,0.02)', 
            width: '110px', 
            height: '110px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            🎯
          </div>

          <div>
            <h2 style={{ 
              fontFamily: 'Cinzel, serif', 
              color: 'var(--accent-gold)', 
              fontSize: '1.8rem', 
              margin: '0 0 0.6rem 0',
              fontWeight: 700
            }}>
              Gomoku Arena
            </h2>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem', 
              lineHeight: '1.6', 
              margin: 0 
            }}>
              經典黑白五子棋對決。提供雙人博弈、精緻打磨的天然木質棋盤與優雅的落子石擊音效。
            </p>
          </div>

          <button 
            className="action-btn" 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(207, 168, 98, 0.2) 0%, rgba(207, 168, 98, 0.4) 100%)',
              borderColor: 'var(--accent-gold)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginTop: '0.5rem'
            }}
          >
            進入競技場 ▶️
          </button>
        </div>

        {/* Game 2 Card: Japanese Word Master */}
        <div 
          className="glass-panel main-menu-card" 
          onClick={() => onSelectGame('japanese')}
          style={{ 
            cursor: 'pointer',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Glowing Circle */}
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(168, 207, 98, 0.08) 0%, transparent 70%)',
            top: '-20px',
            right: '-20px',
            borderRadius: '50%'
          }} />

          <div style={{ 
            fontSize: '4.5rem', 
            background: 'rgba(255,255,255,0.02)', 
            width: '110px', 
            height: '110px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            🌸
          </div>

          <div>
            <h2 style={{ 
              fontFamily: "'Noto Sans TC', sans-serif", 
              color: 'var(--text-main)', 
              fontSize: '1.8rem', 
              margin: '0 0 0.6rem 0',
              fontWeight: 700
            }}>
              日語單字達人
            </h2>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem', 
              lineHeight: '1.6', 
              margin: 0 
            }}>
              日語單字高效學習中心。透過連連看配對、四選一挑戰和極速打字，配合 native 語音播放，極速加深單字记忆！
            </p>
          </div>

          <button 
            className="action-btn" 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginTop: '0.5rem'
            }}
          >
            開始修煉 ▶️
          </button>
        </div>

        {/* Game 3 Card: Go Arena */}
        <div 
          className="glass-panel main-menu-card" 
          onClick={() => onSelectGame('go')}
          style={{ 
            cursor: 'pointer',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Glowing Circle */}
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(207, 168, 98, 0.12) 0%, transparent 70%)',
            top: '-20px',
            right: '-20px',
            borderRadius: '50%'
          }} />

          <div style={{ 
            fontSize: '4.5rem', 
            background: 'rgba(255,255,255,0.02)', 
            width: '110px', 
            height: '110px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            ☯️
          </div>

          <div>
            <h2 style={{ 
              fontFamily: "'Noto Sans TC', sans-serif", 
              color: 'var(--accent-gold)', 
              fontSize: '1.8rem', 
              margin: '0 0 0.6rem 0',
              fontWeight: 700
            }}>
              圍棋對弈場
            </h2>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem', 
              lineHeight: '1.6', 
              margin: 0 
            }}>
              經典東方智慧博弈。支援 19x19、13x13 與 9x9 規格，完美計算氣與提子，限制打劫與自殺禁著點，附設即時局勢估算與全自動數子判定。
            </p>
          </div>

          <button 
            className="action-btn" 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(207, 168, 98, 0.2) 0%, rgba(207, 168, 98, 0.4) 100%)',
              borderColor: 'var(--accent-gold)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginTop: '0.5rem'
            }}
          >
            落子定乾坤 ▶️
          </button>
        </div>
      </main>

      {/* Decorative Bottom Ambient Glows */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(207, 168, 98, 0.04) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
        bottom: '-150px',
        right: '-100px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
    </div>
  );
}
