export type TetrominoShape = (string | number)[][];

export type Tetromino = {
    shape: TetrominoShape;
    color: string;
}

export type CellState = [string | number, 'clear' | 'merged'];

export type BoardState = CellState[][];

export type Player = {
  pos: { x: number; y: number };
  tetromino: Tetromino;
  collided: boolean;
};
