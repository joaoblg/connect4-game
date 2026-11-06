import React, { useState } from 'react';


const PlayerSetup = ({ onStart }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [vsBot, setVsBot] = useState(false); 

  const handleStart = () => {
    if (player1 && (vsBot || player2)) {
      onStart({ player1, player2: vsBot ? 'CPU 🤖' : player2 }, vsBot);
    } else {
      alert("Preencha os nomes dos jogadores!");
    }
  };


  return (
    
    <div className="player-setup">
      <h1>4 em Linha</h1>
      <h2>Configuração do Jogo</h2>
      <p>Defina o(s) nome(s) do(s) jogador(es):</p>  

      <input
        type="text"
        placeholder="Nome do Jogador 1"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />
      {!vsBot && (
        <input
          type="text"
          placeholder="Nome do Jogador 2"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
      )}
      <label>
        <input
          type="checkbox"
          checked={vsBot}
          onChange={() => setVsBot(!vsBot)}
        />
        Jogar contra CPU 🤖
      </label>
      <br />
      <button onClick={handleStart}>Iniciar Jogo</button>
    </div>
  );
};

export default PlayerSetup;




