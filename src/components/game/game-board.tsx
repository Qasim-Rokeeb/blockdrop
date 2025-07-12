
"use client";

import React from 'react';
import Cell from './cell';
import type { BoardState, Player } from '@/types/tetris';

type GameBoardProps = {
  board: BoardState;
  player: Player;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, player }) => {
  const displayBoard = JSON.parse(JSON.stringify(board));

  player.tetromino.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + player.pos.y;
        const boardX = x + player.pos.x;
        if (displayBoard[boardY] && displayBoard[boardY][boardX]) {
           displayBoard[boardY][boardX] = [value, 'clear'];
        }
      }
    });
  });

  return (
    <div
      className="grid border-2 border-primary/50 bg-black/30 shadow-lg rounded-lg overflow-hidden shadow-[0_0_20px_theme(colors.primary/0.5)]"
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
        width: 'min(45vh, 350px)',
        height: 'min(90vh, 700px)',
      }}
    >
      {displayBoard.map((row: [string|number, string][], y: number) =>
        row.map((cell: [string|number, string], x: number) => <Cell key={`${y}-${x}`} type={cell[0]} />)
      )}
    </div>
  );
};

export default GameBoard;
