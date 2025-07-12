export type TetrominoShape = (string | number)[][];

export type BoardState = (string | number)[][];

export type Player = {
  pos: { x: number; y: number };
  tetromino: TetrominoShape;
  collided: boolean;
};
