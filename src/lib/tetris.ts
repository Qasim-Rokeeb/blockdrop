export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const createBoard = (): (string | number)[][] =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const TETROMINOES: {
  [key: string]: { shape: (string | number)[][]; color: string };
} = {
  '0': { shape: [[0]], color: 'rgba(51, 51, 51, 0.8)' }, // Empty cell color with some transparency
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
    ],
    color: 'rgb(80, 227, 230)', // Cyan
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0],
    ],
    color: 'rgb(36, 95, 223)', // Blue
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L'],
    ],
    color: 'rgb(223, 173, 36)', // Orange
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O'],
    ],
    color: 'rgb(223, 217, 36)', // Yellow
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0],
    ],
    color: 'rgb(48, 211, 56)', // Green
  },
  T: {
    shape: [
      ['T', 'T', 'T'],
      [0, 'T', 0],
      [0, 0, 0],
    ],
    color: 'rgb(175, 47, 215)', // Purple
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0],
    ],
    color: 'rgb(227, 78, 78)', // Red
  },
};

export const randomTetromino = (): { shape: (string | number)[][]; color: string; } => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOES[randTetromino];
};
