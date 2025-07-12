"use client";

import React from 'react';
import Cell from './cell';
import type { BoardState } from '@/types/tetris';

type GameBoardProps = {
  board: BoardState;
};

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
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
      {board.map((row, y) =>
        row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell} />)
      )}
    </div>
  );
};

export default GameBoard;
