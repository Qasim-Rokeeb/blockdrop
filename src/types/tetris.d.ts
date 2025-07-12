export type TetrominoShape = (string | number)[][];

export type CellState = [string | number, 'clear' | 'merged'];

export type BoardState = CellState[][];

export type Player = {
  pos: { x: number; y: number };
  tetromino: TetrominoShape;
  collided: boolean;
};

    