
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

  if (!player.collided) {
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + player.pos.y;
          const boardX = x + player.pos.x;
          if (displayBoard[boardY]) {
             displayBoard[boardY][boardX] = [value, 'clear'];
          }
        }
      });
    });
  }

  return (
    <div
      className="grid border-l border-t border-white/20 bg-black/30 shadow-lg rounded-lg overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
        width: 'min(40vh, 300px)',
        height: 'min(80vh, 600px)',
      }}
    >
      {displayBoard.map((row: [string|number, string][], y: number) =>
        row.map((cell: [string|number, string], x: number) => <Cell key={`${y}-${x}`} type={cell[0]} />)
      )}
    </div>
  );
};

export default GameBoard;

    