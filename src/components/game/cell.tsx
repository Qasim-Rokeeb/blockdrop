
"use client";

import React from 'react';
import { TETROMINOES } from '@/lib/tetris';

type CellProps = {
  type: string | number;
};

const Cell: React.FC<CellProps> = ({ type }) => {
  const colorKey = typeof type === 'string' ? type : '0';
  const color = TETROMINOES[colorKey]?.color || TETROMINOES['0'].color;
  const isFilled = type !== 0;

  return (
    <div
      className="aspect-square w-full"
      style={{ 
        backgroundColor: color,
        boxShadow: isFilled 
          ? 'inset 1px 1px 2px rgba(255, 255, 255, 0.2), inset -1px -1px 2px rgba(0, 0, 0, 0.3)' 
          : 'none',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
       }}
    ></div>
  );
};

export default React.memo(Cell);

  