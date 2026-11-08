import React, { useState, useEffect, useRef } from 'react';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import './styles/Game.css';

// Dimensões oficiais do Quatro em Linha (Connect 4)
const ROWS = 6;
const COLS = 7;
const TURN_TIME_LIMIT = 15; // 15 segundos por turno

// Função para criar um tabuleiro vazio (6 linhas e 7 colunas)
const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Gerador de células especiais bónus (4 células aleatórias)
const generateSpecialCells = (count = 4) => {
  const positions = new Set();
  while (positions.size < count) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    positions.add(`${row},${col}`);
  }
  return [...positions].map((pos) => {
    const [row, col] = pos.split(',').map(Number);
    return { row, col };
  });
};

function App() {
  const [specialCells, setSpecialCells] = useState([]);
  const [players, setPlayers] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [playerColors] = useState({
    player1: 'red',
    player2: 'yellow',
  });
  const [board, setBoard] = useState(createEmptyBoard);
  const [timer, setTimer] = useState(0);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [isVsBot, setIsVsBot] = useState(false);
  const [empate, setEmpate] = useState(false);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [bonusMessage, setBonusMessage] = useState(null);

  const botShouldRepeat = useRef(false);

  // Iniciar partida
  const startGame = (playerInfo, vsBot = false) => {
    setPlayers(playerInfo);
    setCurrentPlayer('player1');
    setBoard(createEmptyBoard());
    setWinner(null);
    setWinningCells([]);
    setEmpate(false);
    setTimer(0);
    setScores({ player1: 0, player2: 0 });
    setBonusMessage(null);
    setSpecialCells(generateSpecialCells());
    setIsVsBot(vsBot);
  };

  // Alternar turno entre jogadores
  const switchTurn = (fromPlayer) => {
    const next = fromPlayer === 'player1' ? 'player2' : 'player1';
    setCurrentPlayer(next);
    setTimer(0);
  };

  // Temporizador de turno (se passar dos 15s sem jogar, passa a vez)
  useEffect(() => {
    if (!players || winner || empate) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= TURN_TIME_LIMIT) {
          switchTurn(currentPlayer);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [players, currentPlayer, winner, empate]);

  // Jogada do Bot
  const botPlay = () => {
    if (winner || empate) return;

    // Encontrar colunas válidas (que ainda têm espaço no topo)
    const validCols = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        validCols.push(c);
      }
    }

    if (validCols.length === 0) return;

    let chosenCol = null;

    // 1. Tática Ofensiva: O Bot pode vencer na próxima jogada?
    for (let c of validCols) {
      const tempBoard = board.map((row) => [...row]);
      let placedRow = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (!tempBoard[r][c]) {
          tempBoard[r][c] = playerColors.player2;
          placedRow = r;
          break;
        }
      }
      if (placedRow !== -1 && checkWin(placedRow, c, playerColors.player2, tempBoard).won) {
        chosenCol = c;
        break;
      }
    }

    // 2. Tática Defensiva: O Jogador 1 vai vencer na próxima? Bloquear!
    if (chosenCol === null) {
      for (let c of validCols) {
        const tempBoard = board.map((row) => [...row]);
        let placedRow = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (!tempBoard[r][c]) {
            tempBoard[r][c] = playerColors.player1;
            placedRow = r;
            break;
          }
        }
        if (placedRow !== -1 && checkWin(placedRow, c, playerColors.player1, tempBoard).won) {
          chosenCol = c;
          break;
        }
      }
    }

    // 3. Prioridade Estratégica: colunas centrais têm mais valor no 4 em Linha
    if (chosenCol === null) {
      const centerPriority = [3, 2, 4, 1, 5, 0, 6].filter((c) => validCols.includes(c));
      // 70% das vezes escolhe a coluna central disponível, 30% aleatória
      if (Math.random() < 0.7 && centerPriority.length > 0) {
        chosenCol = centerPriority[0];
      } else {
        chosenCol = validCols[Math.floor(Math.random() * validCols.length)];
      }
    }

    handlePlay(chosenCol, 'player2');
  };

  // Efeito para acionar jogada do Bot
  useEffect(() => {
    if (isVsBot && currentPlayer === 'player2' && !winner && !empate) {
      const delay = setTimeout(() => {
        botPlay();
      }, 700);
      return () => clearTimeout(delay);
    }
  }, [currentPlayer, isVsBot, winner, empate]);

  // Repetição do Bot caso caia em célula especial
  useEffect(() => {
    if (botShouldRepeat.current && !winner && !empate) {
      botShouldRepeat.current = false;
      const delay = setTimeout(() => {
        botPlay();
      }, 850);
      return () => clearTimeout(delay);
    }
  }, [board]);

  // Verificar vitória (horizontal, vertical, diagonais)
  const checkWin = (row, col, symbol, customBoard = board) => {
    const directions = [
      { dr: 0, dc: 1 }, // Horizontal ➔
      { dr: 1, dc: 0 }, // Vertical ⬇
      { dr: 1, dc: 1 }, // Diagonal descendente ↘
      { dr: -1, dc: 1 }, // Diagonal ascendente ↗
    ];

    for (let { dr, dc } of directions) {
      let count = 1;
      let winning = [{ row, col }];

      // Direção positiva
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && customBoard[r][c] === symbol) {
          count++;
          winning.push({ row: r, col: c });
        } else break;
      }

      // Direção negativa
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && customBoard[r][c] === symbol) {
          count++;
          winning.push({ row: r, col: c });
        } else break;
      }

      if (count >= 4) {
        return { won: true, winningCells: winning };
      }
    }

    return { won: false, winningCells: [] };
  };

  // Executar jogada
  const handlePlay = (col, player = currentPlayer) => {
    if (winner || empate) return false;
    if (board[0][col] !== null) return false; // Coluna cheia

    const newBoard = board.map((row) => [...row]);

    // Deixar a peça cair até a linha mais baixa vazia
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        const symbol = playerColors[player];
        newBoard[row][col] = symbol;

        const isSpecial = specialCells.some(
          (cell) => cell.row === row && cell.col === col
        );

        setBoard(newBoard);
        setTimer(0);

        // Verificar vitória
        const winResult = checkWin(row, col, symbol, newBoard);
        if (winResult.won) {
          setWinner(players[player]);
          setWinningCells(winResult.winningCells);
          setScores((prev) => ({
            ...prev,
            [player]: prev[player] + 1,
          }));
          return false;
        }

        // Verificar empate (todas as células preenchidas)
        const isBoardFull = newBoard.every((rowArr) =>
          rowArr.every((cell) => cell !== null)
        );
        if (isBoardFull) {
          setEmpate(true);
          return false;
        }

        // Célula Especial = Bónus: Joga novamente!
        if (isSpecial) {
          setBonusMessage(`⭐ ${players[player]} ativou uma Célula Bónus e joga novamente!`);
          setTimeout(() => setBonusMessage(null), 3000);

          if (player === 'player2' && isVsBot) {
            botShouldRepeat.current = true;
          }
          return true;
        }

        // Troca de turno normal
        setTimeout(() => switchTurn(player), 200);
        return false;
      }
    }

    return false;
  };

  // Reiniciar rodada mantendo placar
  const resetRound = () => {
    setBoard(createEmptyBoard());
    setWinner(null);
    setWinningCells([]);
    setEmpate(false);
    setTimer(0);
    setBonusMessage(null);
    setSpecialCells(generateSpecialCells());
    setCurrentPlayer((prev) => (prev === 'player1' ? 'player2' : 'player1'));
  };

  // Reiniciar células especiais
  const resetSpecialCells = () => {
    setSpecialCells(generateSpecialCells());
    setBonusMessage('⭐ Células bónus redistribuídas pelo tabuleiro!');
    setTimeout(() => setBonusMessage(null), 2500);
  };

  // Voltar ao menu inicial
  const returnToMenu = () => {
    setPlayers(null);
    setWinner(null);
    setWinningCells([]);
    setEmpate(false);
  };

  return (
    <div className="game-container">
      {!players ? (
        <PlayerSetup onStart={startGame} />
      ) : (
        <>
          {/* Header */}
          <div className="game-header">
            <h1 className="game-title">🔴 4 em Linha 🟡</h1>
            <p className="game-subtitle">Grelha Oficial • 6 Linhas × 7 Colunas</p>
          </div>

          {/* Status HUD */}
          <div className="status-hud">
            {/* Player 1 Card */}
            <div
              className={`player-card ${
                currentPlayer === 'player1' && !winner && !empate
                  ? 'active red-turn'
                  : ''
              } ${winner === players.player1 ? 'winner' : ''}`}
            >
              <div className="player-avatar red">👤</div>
              <div className="player-info">
                <span className="player-name">{players.player1}</span>
                <span className="player-sub">Vermelho</span>
                {currentPlayer === 'player1' && !winner && !empate && (
                  <span className="turn-badge">A JOGAR</span>
                )}
              </div>
            </div>

            {/* Match Meta (Timer & Score) */}
            <div className="match-meta">
              <div
                className={`timer-circle ${
                  timer >= TURN_TIME_LIMIT - 4 ? 'urgent' : ''
                }`}
              >
                <span className="timer-value">
                  {Math.max(0, TURN_TIME_LIMIT - timer)}
                </span>
                <span className="timer-label">SEG</span>
              </div>
              <div className="score-display">
                {scores.player1} — {scores.player2}
              </div>
            </div>

            {/* Player 2 Card */}
            <div
              className={`player-card ${
                currentPlayer === 'player2' && !winner && !empate
                  ? 'active yellow-turn'
                  : ''
              } ${winner === players.player2 ? 'winner' : ''}`}
            >
              <div className="player-avatar yellow">
                {isVsBot ? '🤖' : '👤'}
              </div>
              <div className="player-info">
                <span className="player-name">{players.player2}</span>
                <span className="player-sub">Amarelo</span>
                {currentPlayer === 'player2' && !winner && !empate && (
                  <span className="turn-badge">A JOGAR</span>
                )}
              </div>
            </div>
          </div>

          {/* Winner / Draw / Bonus Alerts */}
          {winner && (
            <div className="alert-banner winner">
              🏆 Parabéns, <strong>{winner}</strong> venceu a partida! 🎉
            </div>
          )}

          {empate && !winner && (
            <div className="alert-banner draw">
              🤝 Empate! O tabuleiro ficou completamente preenchido.
            </div>
          )}

          {bonusMessage && !winner && (
            <div className="alert-banner bonus">{bonusMessage}</div>
          )}

          {/* Main Game Board */}
          <GameBoard
            board={board}
            onPlay={handlePlay}
            currentPlayer={currentPlayer}
            playerColors={playerColors}
            specialCells={specialCells}
            isBotTurn={isVsBot && currentPlayer === 'player2'}
            winningCells={winningCells}
            winner={winner}
          />

          {/* Controls Bar */}
          <div className="controls-bar">
            <button type="button" onClick={resetRound} className="btn-secondary">
              🔄 Nova Rodada
            </button>
            <button
              type="button"
              onClick={resetSpecialCells}
              className="btn-secondary"
            >
              ⭐ Novas Células Bónus
            </button>
            <button type="button" onClick={returnToMenu} className="btn-secondary">
              ⚙️ Menu / Trocar Modo
            </button>
          </div>

          {/* Clean Footer - Only João Bernardo */}
          <footer className="footer">
            <p>
              Desenvolvido por <strong>João Bernardo Graça</strong>
            </p>
            <p>4 em Linha • React 19 &amp; Vite • ISEC LEI-DA</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
