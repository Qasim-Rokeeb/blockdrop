"use client";

import React from 'react';
import { TETROMINOES } from '@/lib/tetris';

type CellProps = {
  type: string | number;
};

const Cell: React.FC<CellProps> = ({ type }) => {
  const color = TETROMINOES[type as keyof typeof TETROMINOES]?.color || TETROMINOES['0'].color;
  const isFilled = type !== 0;

  return (
    <div
      className="aspect-square w-full"
      style={{ 
        backgroundColor: color,
        boxShadow: isFilled 
          ? 'inset 2px 2px 4px rgba(255, 255, 255, 0.2), inset -2px -2px 4px rgba(0, 0, 0, 0.3)' 
          : 'none',
       }}
    ></div>
  );
};

export default React.memo(Cell);
