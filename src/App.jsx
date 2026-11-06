import React, { useState, useEffect } from 'react';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import './styles/Game.css';
import { useRef } from 'react';


// Função para criar um tabuleiro vazio
// (6 linhas e 7 colunas)
const createEmptyBoard = () =>
  Array.from({ length: 4 }, () => Array(4).fill(null));

// Componente principal do jogo
// (contém o estado do jogo, tabuleiro, jogadores, etc.)
function App() {
  const [specialCells, setSpecialCells] = useState([]);
  const [players, setPlayers] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerColors, setPlayerColors] = useState({});
  const [board, setBoard] = useState(createEmptyBoard);
  const [timer, setTimer] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isVsBot, setIsVsBot] = useState(false);
  const botShouldRepeat = useRef(false);
  const[empate, setEmpate] = useState(false);

  //trocar celulas especiais
  const resetSpecialCells = () => {
    setSpecialCells(generateSpecialCells());
  };
 


// Função para gerar células especiais aleatórias
// (exemplo: 3 células especiais)
const generateSpecialCells = (count = 5) => {
  const positions = new Set();
  while (positions.size < count) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);
    positions.add(`${row},${col}`);
  }
  return [...positions].map(pos => {
    const [row, col] = pos.split(',').map(Number);
    return { row, col };
  });
};


  // Função para iniciar o jogo

  const startGame = (playerInfo, vsBot = false) => {
    const starter = Math.random() < 0.5 ? 'player1' : 'player2';
    const colors = {
      player1: 'red',
      player2: 'yellow',
    };
  
    setPlayers(playerInfo);
    setCurrentPlayer(starter);
    setPlayerColors(colors);
    setBoard(createEmptyBoard());
    setWinner(null);
    setTimer(0);
    setSpecialCells(generateSpecialCells());
    setIsVsBot(vsBot);
  };
  


  // Efeito para reiniciar o temporizador
  // (se houver jogadores e não houver vencedor)
  // (se o temporizador chegar a 10 segundos, alterna o jogador)

 useEffect(() => {
  if (!players || winner) return;

  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev >= 10) {
        clearInterval(interval);
        setTimer(0);
        switchTurn(currentPlayer); // <-- passa quem estava a jogar
        return 0;
      }
      return prev + 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [currentPlayer, winner]);

// Efeito para reiniciar o bot
// (se o bot tiver feito uma jogada especial, repetir a jogada)

useEffect(() => {
  if (botShouldRepeat.current) {
    botShouldRepeat.current = false; // reseta flag
    setTimeout(() => {
      botPlay(); // só agora, depois de renderizar a primeira peça
    }, 1500);
  }
}, [board]);


// Efeito para fazer a jogada do bot
  // (se o jogo for contra o bot)
  // (apenas se o jogador atual for o bot e não houver vencedor)
  // (delay de 500ms para simular o tempo de resposta do bot)
  // (se o bot fizer uma jogada especial, repetir a jogada)

useEffect(() => {
  if (isVsBot && currentPlayer === 'player2' && !winner) {
    const delay = setTimeout(() => {
      botPlay();
    }, 1500);
    return () => clearTimeout(delay);
  }
}, [currentPlayer, isVsBot, winner]);

  
  // Função para alternar entre os jogadores

  const switchTurn = (fromPlayer) => {
  const next = fromPlayer === 'player1' ? 'player2' : 'player1';
  setCurrentPlayer(next);
  setTimer(0);
};


  // Função para fazer a jogada do bot
  // (escolhe uma coluna aleatória disponível)
  // (se a coluna escolhida for especial, repetir a jogada)
  // (se houver vencedor, não fazer mais jogadas)

const botPlay = () => {
  if (winner) return;

  const validCols = board[0]
    .map((_, colIndex) => (board[0][colIndex] === null ? colIndex : null))
    .filter(col => col !== null);

  const randomCol = validCols[Math.floor(Math.random() * validCols.length)];

  if (randomCol !== undefined) {
    handlePlay(randomCol, 'player2');
  }
};


  // Função para reiniciar o jogo
  // (reseta o tabuleiro, jogadores, vencedor, etc.)
  // (também reinicia o temporizador)
  // (também gera novas células especiais)
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setWinner(null);
    setTimer(0);
    setEmpate(false);
    setSpecialCells(generateSpecialCells());
    setCurrentPlayer((prev) => (prev === 'player1' ? 'player2' : 'player1')); 
  };

  // Função para verificar se há uma vitória
  // (horizontal, vertical ou diagonal)

  const checkWin = (row, col, symbol, customBoard = board) => {
    const directions = [
      { dr: 0, dc: 1 },   // →
      { dr: 1, dc: 0 },   // ↓
      { dr: 1, dc: 1 },   // ↘
      { dr: -1, dc: 1 }   // ↗
    ];
  
    for (let { dr, dc } of directions) {
      let count = 1;
  
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < 4 && c >= 0 && c < 4 && customBoard[r][c] === symbol) {
          count++;
        } else break;
      }
  
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < 4 && c >= 0 && c < 4 && customBoard[r][c] === symbol) {
          count++;
        } else break;
      }
  
      if (count >= 4) return true;
    }
  
    return false;
  };
  

  // Função para fazer uma jogada
  // (coloca o símbolo do jogador na coluna escolhida)
  // (verifica se há um vencedor após a jogada)
  // (se houver um vencedor, não alterna o jogador)
  // (se a célula escolhida for especial, não alterna o jogador)
 const handlePlay = (col, player = currentPlayer) => {
  if (winner) return false;

  const newBoard = board.map(row => [...row]);

  for (let row = 3; row >= 0; row--) {
    if (!newBoard[row][col]) {
      const symbol = playerColors[player];
      newBoard[row][col] = symbol;

      const isSpecial = specialCells.some(cell => cell.row === row && cell.col === col);

      setBoard(newBoard);
      setEmpate(false); 
      setTimer(0);

     
      const isBoardFull = newBoard.every(rowArr => rowArr.every(cell => cell !== null));
      if (isBoardFull) {
      setEmpate(true);  
      return false;
    }

      const hasWon = checkWin(row, col, symbol, newBoard);
      if (hasWon) {
        setWinner(players[player]);
        return false;
      }

      if (isSpecial && player === 'player2' && isVsBot) {
        botShouldRepeat.current = true; // MARCA que o bot deve jogar novamente depois
        return true;
      }

      if (!isSpecial) {
        setTimeout(() => switchTurn(player), 200);
      }

      return isSpecial;
    }
  }

  return false;
};




  // Renderiza o componente
  // (se não houver jogadores, exibe o painel de configuração)

  return (
    <div className="game-container">
      {!players ? (
        <PlayerSetup onStart={startGame} />
      ) : (
        <>
          <div className="status-panel">
            <p>Jogador Atual: {players[currentPlayer]} ({playerColors[currentPlayer]})</p>
            <p>Tempo: {timer}s</p>
          </div>
          {winner && <div className="winner-message">🏆 {winner} Venceu o jogo! 🎉</div>}
          {empate && !winner && <div className="winner-message">🤝 Empate! O tabuleiro está cheio.</div>}
          <GameBoard
            board={board}
            onPlay={handlePlay}
            currentPlayer={currentPlayer}
            playerColors={playerColors}
            specialCells={specialCells}
            isBotTurn={isVsBot && currentPlayer === 'player2'}
          />
          <button onClick={resetGame} className="reset-btn">Reiniciar Jogo</button>
          <p><button onClick={resetSpecialCells} className="reset-btn">Resetar Células Especiais</button></p>
        
          <div className="footer">
            <p>Desenvolvido por "João Bernardo & António Simões"</p>
            <p>4EmLinha</p>
            <p>2025</p>
          </div>

        </>
      )}
    </div>
  );
}



export default App;
//falta so proibir o humano jogar na vez do bot quando selecionado o modo contra o bot