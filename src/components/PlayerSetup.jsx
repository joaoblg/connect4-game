import React, { useState } from 'react';

const PlayerSetup = ({ onStart }) => {
  const [player1, setPlayer1] = useState('Jogador 1');
  const [player2, setPlayer2] = useState('Jogador 2');
  const [vsBot, setVsBot] = useState(false);

  const handleStart = () => {
    const p1 = player1.trim() || 'Jogador 1';
    const p2 = vsBot ? 'CPU Bot' : (player2.trim() || 'Jogador 2');
    onStart({ player1: p1, player2: p2 }, vsBot);
  };

  return (
    <div className="player-setup">
      <h1>4 em Linha</h1>
      <h2>Configuração da Partida</h2>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          type="button"
          className={`mode-btn ${!vsBot ? 'active' : ''}`}
          onClick={() => setVsBot(false)}
        >
          <span>👥</span> 1 vs 1 Local
        </button>
        <button
          type="button"
          className={`mode-btn ${vsBot ? 'active' : ''}`}
          onClick={() => setVsBot(true)}
        >
          <span>🤖</span> Contra o Bot
        </button>
      </div>

      <div className="input-group">
        <div className="input-field">
          <label>
            <span className="token-indicator red"></span> Jogador 1 (Peças Vermelhas)
          </label>
          <input
            type="text"
            placeholder="Nome do Jogador 1"
            value={player1}
            maxLength={18}
            onChange={(e) => setPlayer1(e.target.value)}
          />
        </div>

        {!vsBot && (
          <div className="input-field">
            <label>
              <span className="token-indicator yellow"></span> Jogador 2 (Peças Amarelas)
            </label>
            <input
              type="text"
              placeholder="Nome do Jogador 2"
              value={player2}
              maxLength={18}
              onChange={(e) => setPlayer2(e.target.value)}
            />
          </div>
        )}
      </div>

      <button type="button" className="btn-primary" onClick={handleStart}>
        Começar Jogo 🚀
      </button>

      <footer className="footer" style={{ marginTop: '24px' }}>
        <p>Desenvolvido por <strong>João Bernardo Graça</strong></p>
        <p>ISEC — Engenharia Informática</p>
      </footer>
    </div>
  );
};

export default PlayerSetup;
