import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

function App() {
  const [characters, setCharacters] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [battleHistory, setBattleHistory] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch characters
    fetch('/api/characters')
      .then(res => res.json())
      .then(data => setCharacters(data));

    // Fetch battle history
    fetch('/api/battles')
      .then(res => res.json())
      .then(data => setBattleHistory(data));

    // Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));

    // Socket listeners
    socket.on('userCount', (count) => {
      setOnlineUsers(count);
    });

    socket.on('battleResult', (result) => {
      setBattleHistory(prev => [...prev.slice(-9), result]);
    });

    return () => {
      socket.off('userCount');
      socket.off('battleResult');
    };
  }, []);

  const handleBattle = async () => {
    if (!selectedPlayer1 || !selectedPlayer2) {
      alert('Please select both characters!');
      return;
    }

    if (selectedPlayer1.id === selectedPlayer2.id) {
      alert('Characters cannot battle themselves!');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/battle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1Id: selectedPlayer1.id,
          player2Id: selectedPlayer2.id,
        }),
      });

      const result = await response.json();
      setBattleResult(result);
      
      // Refresh stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
    } catch (error) {
      console.error('Battle error:', error);
      alert('Battle failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetBattle = () => {
    setSelectedPlayer1(null);
    setSelectedPlayer2(null);
    setBattleResult(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🥊 Anime Battle Arena</h1>
        <div className="online-counter">
          <span>👥 Online: {onlineUsers}</span>
          <span>⚔️ Total Battles: {stats?.totalBattles || 0}</span>
        </div>
      </header>

      <main className="main-content">
        {!battleResult ? (
          <div className="battle-setup">
            <h2>Choose Your Fighters!</h2>
            
            <div className="character-selection">
              <div className="player-section">
                <h3>Player 1</h3>
                <div className="character-grid">
                  {characters.map(char => (
                    <div
                      key={char.id}
                      className={`character-card ${selectedPlayer1?.id === char.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPlayer1(char)}
                    >
                      <div className="character-image">
                        <span className="character-emoji">🥷</span>
                      </div>
                      <h4>{char.name}</h4>
                      <p className="anime-name">{char.anime}</p>
                      <div className="stats">
                        <div>⚡ {char.power}</div>
                        <div>🏃 {char.speed}</div>
                        <div>🛡️ {char.defense}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="vs-section">
                <h2>VS</h2>
                <button 
                  className="battle-button"
                  onClick={handleBattle}
                  disabled={loading || !selectedPlayer1 || !selectedPlayer2}
                >
                  {loading ? '⚔️ BATTLING...' : '🥊 BATTLE!'}
                </button>
              </div>

              <div className="player-section">
                <h3>Player 2</h3>
                <div className="character-grid">
                  {characters.map(char => (
                    <div
                      key={char.id}
                      className={`character-card ${selectedPlayer2?.id === char.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPlayer2(char)}
                    >
                      <div className="character-image">
                        <span className="character-emoji">🥷</span>
                      </div>
                      <h4>{char.name}</h4>
                      <p className="anime-name">{char.anime}</p>
                      <div className="stats">
                        <div>⚡ {char.power}</div>
                        <div>🏃 {char.speed}</div>
                        <div>🛡️ {char.defense}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="battle-result">
            <h2>🏆 Battle Result</h2>
            <div className="result-display">
              <div className="fighter">
                <h3>{battleResult.player1.name}</h3>
                <div className="score">Score: {battleResult.p1Score}</div>
                <div className={`result ${battleResult.winner.id === battleResult.player1.id ? 'winner' : 'loser'}`}>
                  {battleResult.winner.id === battleResult.player1.id ? '🏆 WINNER!' : '😵 DEFEATED'}
                </div>
              </div>
              
              <div className="vs">VS</div>
              
              <div className="fighter">
                <h3>{battleResult.player2.name}</h3>
                <div className="score">Score: {battleResult.p2Score}</div>
                <div className={`result ${battleResult.winner.id === battleResult.player2.id ? 'winner' : 'loser'}`}>
                  {battleResult.winner.id === battleResult.player2.id ? '🏆 WINNER!' : '😵 DEFEATED'}
                </div>
              </div>
            </div>
            
            <div className="winner-announcement">
              <h3>🎉 {battleResult.winner.name} wins with {battleResult.winner.special}!</h3>
              <p>{battleResult.winner.description}</p>
            </div>
            
            <button className="reset-button" onClick={resetBattle}>
              🔄 Battle Again
            </button>
          </div>
        )}

        <div className="sidebar">
          <div className="stats-section">
            <h3>📊 Top Fighters</h3>
            {stats?.popularCharacters.map((char, index) => (
              <div key={char.id} className="stat-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{char.name}</span>
                <span className="wins">{char.battlesWon}W</span>
              </div>
            ))}
          </div>

          <div className="history-section">
            <h3>📜 Recent Battles</h3>
            {battleHistory.slice(-5).reverse().map((battle, index) => (
              <div key={battle.id} className="history-item">
                <div className="battle-info">
                  <span className="fighters">
                    {battle.player1.name} vs {battle.player2.name}
                  </span>
                  <span className="winner">
                    🏆 {battle.winner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
