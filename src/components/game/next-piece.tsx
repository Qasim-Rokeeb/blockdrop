"use client";

import React from 'react';
import type { Tetromino } from '@/types/tetris';
import Cell from './cell';

type NextPieceProps = {
  tetromino: Tetromino;
};

const NextPiece: React.FC<NextPieceProps> = ({ tetromino }) => {
  const { shape } = tetromino;
  const boxSize = 4;
  const grid = Array.from({ length: boxSize }, () => Array(boxSize).fill([0, 'clear']));

  const shapeHeight = shape.length;
  const shapeWidth = shape[0].length;
  const startY = Math.floor((boxSize - shapeHeight) / 2);
  const startX = Math.floor((boxSize - shapeWidth) / 2);

  shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        grid[startY + y][startX + x] = [value, 'clear'];
      }
    });
  });

  return (
    <div className="flex justify-center items-center p-2">
      <div
        className="grid bg-black/20 rounded-md"
        style={{
          gridTemplateColumns: `repeat(${boxSize}, 1fr)`,
          gridTemplateRows: `repeat(${boxSize}, 1fr)`,
          width: '100px',
          height: '100px',
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
        )}
      </div>
    </div>
  );
};

export default NextPiece;
