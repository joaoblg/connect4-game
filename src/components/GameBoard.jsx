import React, { useState } from 'react';

const GameBoard = ({
  board,
  onPlay,
  currentPlayer,
  playerColors,
  specialCells = [],
  isBotTurn = false,
  winningCells = [],
  winner = null
}) => {
  const [hoverCol, setHoverCol] = useState(null);

  const numCols = board[0] ? board[0].length : 7;
  const isGameOver = Boolean(winner);

  const handleCellClick = (colIndex) => {
    if (isBotTurn || isGameOver) return;
    onPlay(colIndex, currentPlayer);
  };

  const isWinningCell = (r, c) => {
    return winningCells.some(cell => cell.row === r && cell.col === c);
  };

  return (
    <div className="board-wrapper">
      {/* Top Hover Preview Row */}
      <div className="highlight-row">
        {Array.from({ length: numCols }).map((_, col) => {
          const isActive = hoverCol === col && !isBotTurn && !isGameOver;
          return (
            <div
              key={col}
              className={`highlight-cell ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoverCol(col)}
              onMouseLeave={() => setHoverCol(null)}
              onClick={() => handleCellClick(col)}
            >
              {isActive && (
                <div className={`preview-piece ${playerColors[currentPlayer]}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Arcade Board Cabinet */}
      <div className="board-cabinet">
        <div className="board-grid">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => {
                const isSpecial = specialCells.some(
                  special => special.row === rowIndex && special.col === colIndex
                );
                const isWinning = isWinningCell(rowIndex, colIndex);

                return (
                  <div
                    key={colIndex}
                    className={`cell ${hoverCol === colIndex && !isBotTurn && !isGameOver ? 'hovered' : ''} ${
                      isSpecial ? 'special-cell' : ''
                    }`}
                    onMouseEnter={() => setHoverCol(colIndex)}
                    onMouseLeave={() => setHoverCol(null)}
                    onClick={() => handleCellClick(colIndex)}
                  >
                    {cell && (
                      <div
                        className={`piece ${cell} ${isWinning ? 'winning-piece' : ''}`}
                        style={{
                          animation: isWinning
                            ? undefined
                            : `drop ${0.18 + rowIndex * 0.05}s cubic-bezier(0.25, 1, 0.5, 1)`,
                        }}
                      ></div>
                    )}
                    {!cell && isSpecial && (
                      <span className="special-badge" title="Célula Bónus: joga novamente!">
                        ⭐
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Board Stand Feet */}
      <div className="board-stand">
        <div className="board-stand-foot"></div>
        <div className="board-stand-foot"></div>
      </div>
    </div>
  );
};

export default GameBoard;
