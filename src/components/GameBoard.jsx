import React, { useState } from 'react';

const GameBoard = ({ board, onPlay, currentPlayer, playerColors, specialCells, isBotTurn }) => {
const [hoverCol, setHoverCol] = useState(null);

  return (
    <div className="board">
      <div className="highlight-row">
        {board[0].map((_, col) => (
          <div
            key={col}
            className={`highlight-cell ${hoverCol === col ? 'active' : ''}`}
          >
            {hoverCol === col && (
              <div className={`piece ${playerColors[currentPlayer]}`}></div>
            )}
          </div>
        ))}
      </div>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => {
            const isSpecial = specialCells.some(
              special => special.row === rowIndex && special.col === colIndex
            );
            return (
              <div
                key={colIndex}
                className={`cell ${hoverCol === colIndex ? 'hovered' : ''} ${
                  isSpecial ? 'special-cell' : ''
                }`}
                onMouseEnter={() => setHoverCol(colIndex)}
                onMouseLeave={() => setHoverCol(null)}
                onClick={() => {if (!isBotTurn) onPlay(colIndex, currentPlayer);}}
              >
                {cell && (
                  <div
                    className={`piece ${cell}`}
                    style={{
                      animation: `drop ${0.1 + rowIndex * 0.05}s ease-out`,
                    }}
                  ></div>
                )}
                {!cell && isSpecial && (
                  <span className="special-indicator">⭐</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;