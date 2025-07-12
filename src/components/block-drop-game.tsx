
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createBoard,
  TETROMINOES,
  randomTetromino,
} from '@/lib/tetris';
import { useInterval } from '@/hooks/use-interval';
import type { BoardState, Player, TetrominoShape } from '@/types/tetris';

import GameBoard from './game/game-board';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RefreshCw } from 'lucide-react';

const StatusDisplay: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-2xl font-bold text-primary">{value}</span>
  </div>
);

export function BlockDropGame() {
  const [board, setBoard] = useState<BoardState>(createBoard());
  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOES[0].shape,
    collided: false,
  });
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkCollision = useCallback((
    playerToCheck: Player,
    boardToCheck: BoardState,
    { x: moveX, y: moveY }: { x: number; y: number }
  ): boolean => {
    for (let y = 0; y < playerToCheck.tetromino.length; y += 1) {
      for (let x = 0; x < playerToCheck.tetromino[y].length; x += 1) {
        if (playerToCheck.tetromino[y][x] !== 0) {
          const newY = y + playerToCheck.pos.y + moveY;
          const newX = x + playerToCheck.pos.x + moveX;

          if (
            newY >= BOARD_HEIGHT || 
            newX < 0 || newX >= BOARD_WIDTH ||
            (boardToCheck[newY] && boardToCheck[newY][newX][0] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);
  
  const resetPlayer = useCallback(() => {
    const newTetromino = randomTetromino();
    const newPlayer = {
      pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
      tetromino: newTetromino.shape,
      collided: false,
    };
    
    if (checkCollision(newPlayer, board, { x: 0, y: 0 })) {
      setGameOver(true);
      setDropTime(null);
    } else {
      setPlayer(newPlayer);
    }
  }, [board, checkCollision]);

  const startGame = useCallback(() => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setScore(0);
    setRows(0);
    setLevel(0);
    setGameOver(false);
    setIsPaused(false);
    setDropTime(1000);
    const newTetromino = randomTetromino();
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
      tetromino: newTetromino.shape,
      collided: false,
    });
  }, []);

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided?: boolean }): void => {
    setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x + x, y: prev.pos.y + y },
        collided: collided !== undefined ? collided : prev.collided,
    }));
  };

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const rotate = (matrix: TetrominoShape): TetrominoShape => {
    const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
    return rotated.map(row => row.reverse());
  };

  const playerRotate = (board: BoardState) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);

    let offset = 1;
    while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        // If it can't rotate back, revert to original rotation
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);
        clonedPlayer.pos.x = player.pos.x; // reset position as well
        return; 
      }
    }
    setPlayer(clonedPlayer);
  };
  
  const drop = () => {
    if (isPaused || gameOver) return;

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1 });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        return;
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };
  
  const hardDrop = () => {
    if (isPaused || gameOver) return;
    let dropY = 0;
    while (!checkCollision(player, board, { x: 0, y: dropY + 1 })) {
      dropY++;
    }
    updatePlayerPos({ x: 0, y: dropY, collided: true });
  }

  useEffect(() => {
    if (player.collided) {
        const newBoard = JSON.parse(JSON.stringify(board));
        player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const boardY = y + player.pos.y;
                    const boardX = x + player.pos.x;
                    if (newBoard[boardY]) {
                        newBoard[boardY][boardX] = [value, 'merged'];
                    }
                }
            });
        });

        const sweepRows = (newBoard: BoardState) => {
            let clearedRows = 0;
            const sweptBoard = newBoard.reduce((ack, row) => {
                if (row.every(cell => cell[0] !== 0)) {
                    clearedRows++;
                    ack.unshift(Array(BOARD_WIDTH).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [] as BoardState);
            
            if (clearedRows > 0) {
                setRows(prev => prev + clearedRows);
                const linePoints = [40, 100, 300, 1200];
                setScore(prev => prev + linePoints[clearedRows-1] * (level + 1));
            }
            return sweptBoard;
        }

        setBoard(sweepRows(newBoard));
        resetPlayer();
    }
  }, [player.collided, level, resetPlayer, board]);
  
  useEffect(() => {
    if (!gameOver && rows > (level + 1) * 10) {
        setLevel(prev => prev + 1);
    }
  }, [rows, level, gameOver]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      setDropTime(1000 / (level + 1) + 200);
    } else {
      setDropTime(null);
    }
  }, [level, isPaused, gameOver]);
  
  const move = useCallback((e: React.KeyboardEvent | { key: string }) => {
    if (gameOver || isPaused) return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') drop();
    else if (e.key === 'ArrowUp') playerRotate(board);
    else if (e.key === ' ') hardDrop();
  }, [board, gameOver, isPaused, playerRotate, drop, hardDrop, movePlayer]);
  
  useInterval(() => {
    drop();
  }, dropTime);
  
  const togglePause = () => {
    if (!gameOver) {
      setIsPaused(!isPaused);
    }
  }

  const handleMobileInput = (key: string) => {
    if (!gameOver && !isPaused) {
      move({ key });
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>, key: string) => {
    e.preventDefault();
    handleMobileInput(key);
  };
  
  return (
    <div 
      className="flex flex-col items-center gap-4 outline-none" 
      role="button" 
      tabIndex={0} 
      onKeyDown={move}
      autoFocus
    >
      <Card className="bg-card/50 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex justify-around gap-6 text-center">
            <StatusDisplay label="Score" value={score} />
            <StatusDisplay label="Rows" value={rows} />
            <StatusDisplay label="Level" value={level} />
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <GameBoard board={board} player={player} />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2 className="text-3xl font-bold text-white">Game Over</h2>
            <Button onClick={startGame} className="mt-4" variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        )}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2 className="text-3xl font-bold text-white">Paused</h2>
            <Button onClick={togglePause} className="mt-4" variant="secondary">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {gameOver ? (
           <Button onClick={startGame} size="lg">
            <Play className="mr-2 h-4 w-4" /> Start Game
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} variant="secondary">
              {isPaused ? <Play/> : <Pause/>}
            </Button>
            <Button onClick={startGame} variant="secondary">
              <RefreshCw />
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-2 md:hidden mt-4 w-full max-w-xs">
          <div className="col-start-2 row-start-1 flex justify-center">
            <Button onTouchStart={(e) => handleTouchStart(e, 'ArrowUp')} className="w-16 h-16"><ArrowUp/></Button>
          </div>
          <div className="col-start-1 row-start-2 flex justify-center">
            <Button onTouchStart={(e) => handleTouchStart(e, 'ArrowLeft')} className="w-16 h-16"><ArrowLeft/></Button>
          </div>
          <div className="col-start-2 row-start-2 flex justify-center">
            <Button onTouchStart={(e) => handleTouchStart(e, 'ArrowDown')} className="w-16 h-16"><ArrowDown/></Button>
          </div>
          <div className="col-start-3 row-start-2 flex justify-center">
            <Button onTouchStart={(e) => handleTouchStart(e, 'ArrowRight')} className="w-16 h-16"><ArrowRight/></Button>
          </div>
          <div className="col-span-3 row-start-3 mt-2">
              <Button onTouchStart={(e) => handleTouchStart(e, ' ')} className="w-full h-16 font-bold">DROP</Button>
          </div>
      </div>
    </div>
  );
}

    