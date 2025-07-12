
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  BOARD_WIDTH,
  createBoard,
  TETROMINOES,
  randomTetromino,
} from '@/lib/tetris';
import { useInterval } from '@/hooks/use-interval';
import type { BoardState, Player, Tetromino, TetrominoShape } from '@/types/tetris';

import GameBoard from './game/game-board';
import NextPiece from './game/next-piece';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RefreshCw, Star, Trophy, Layers } from 'lucide-react';

const StatusDisplay: React.FC<{ icon: React.ReactNode, label: string; value: number | string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="text-primary">{icon}</div>
    <div className="flex flex-col text-center lg:text-left">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  </div>
);

const initialPlayerState: Player = {
  pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
  tetromino: TETROMINOES[0],
  collided: false,
};

export function BlockDropGame() {
  const [board, setBoard] = useState<BoardState>(createBoard());
  const [player, setPlayer] = useState<Player>(initialPlayerState);
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(TETROMINOES[0]);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const startGame = useCallback(() => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setScore(0);
    setRows(0);
    setLevel(0);
    setGameOver(false);
    setIsPaused(false);
    setDropTime(1000);
    
    // Generate pieces on start to avoid hydration issues
    const firstTetromino = randomTetromino();
    setNextTetromino(randomTetromino());
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - Math.ceil(firstTetromino.shape[0].length / 2), y: 0 },
      tetromino: firstTetromino,
      collided: false,
    });
  }, []);

  useEffect(() => {
    if(isClient && gameOver) {
       // On initial load, set a valid "next" piece, but don't start the game.
      setNextTetromino(randomTetromino());
    }
  }, [isClient, gameOver]);


  const checkCollision = useCallback((
    playerToCheck: Player,
    boardToCheck: BoardState,
    { x: moveX, y: moveY }: { x: number; y: number }
  ): boolean => {
    for (let y = 0; y < playerToCheck.tetromino.shape.length; y += 1) {
      for (let x = 0; x < playerToCheck.tetromino.shape[y].length; x += 1) {
        if (playerToCheck.tetromino.shape[y][x] !== 0) {
          const newY = y + playerToCheck.pos.y + moveY;
          const newX = x + playerToCheck.pos.x + moveX;
          if (
            !boardToCheck[newY] ||
            !boardToCheck[newY][newX] ||
            boardToCheck[newY][newX][1] === 'merged'
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);
  
  const resetPlayer = useCallback(() => {
    const newTetromino = nextTetromino;
    setNextTetromino(randomTetromino());

    const newPlayer: Player = {
      pos: { x: BOARD_WIDTH / 2 - Math.ceil(newTetromino.shape[0].length / 2), y: 0 },
      tetromino: newTetromino,
      collided: false,
    };
    
    if (checkCollision(newPlayer, board, { x: 0, y: 0 })) {
      setGameOver(true);
      setDropTime(null);
    } else {
      setPlayer(newPlayer);
    }
  }, [checkCollision, board, nextTetromino]);

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided?: boolean }): void => {
    setPlayer(prev => ({
        ...prev,
        pos: { x: prev.pos.x + x, y: prev.pos.y + y },
        collided: collided !== undefined ? collided : prev.collided,
    }));
  };

  const movePlayer = (dir: number) => {
    if (gameOver || isPaused) return;
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const rotate = (matrix: TetrominoShape): TetrominoShape => {
    const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
    return rotated.map(row => row.reverse());
  };

  const playerRotate = (board: BoardState) => {
    if (gameOver || isPaused) return;
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape);

    let offset = 1;
    while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        return; 
      }
    }
    setPlayer(clonedPlayer);
  };
  
  const drop = useCallback(() => {
    if (isPaused || gameOver) return;

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        return;
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }, [isPaused, gameOver, player, board, checkCollision]);
  
  const hardDrop = () => {
    if (isPaused || gameOver) return;
    let dropY = 0;
    while (!checkCollision(player, board, { x: 0, y: dropY + 1 })) {
      dropY++;
    }
    updatePlayerPos({ x: 0, y: dropY, collided: true });
  };

  useEffect(() => {
    if (player.collided) {
        const newBoard = JSON.parse(JSON.stringify(board));

        player.tetromino.shape.forEach((row, y) => {
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

        let clearedRows = 0;
        const sweptBoard = newBoard.reduce((ack: BoardState, row: (string|number)[][]) => {
            if (row.every(cell => cell[1] === 'merged')) {
                clearedRows++;
                ack.unshift(Array(BOARD_WIDTH).fill([0, 'clear']));
                return ack;
            }
            ack.push(row);
            return ack;
        }, [] as BoardState);
        
        if (clearedRows > 0) {
          const linePoints = [40, 100, 300, 1200];
          setScore(prev => prev + (linePoints[clearedRows-1] || 0) * (level + 1));
          setRows(prev => prev + clearedRows);
        }
        
        setBoard(sweptBoard);
        resetPlayer();
    }
  }, [player.collided, resetPlayer, level, board]);
  
  useEffect(() => {
    if (!gameOver && rows > (level + 1) * 10) {
        setLevel(prev => prev + 1);
        setDropTime(prev => prev ? prev * 0.8 : 1000);
    }
  }, [rows, level, gameOver]);
  
  const move = useCallback((e: { key: string }) => {
    if (gameOver || isPaused) return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') drop();
    else if (e.key === 'ArrowUp') playerRotate(board);
    else if (e.key === ' ') hardDrop();
  },[board, drop, gameOver, isPaused, playerRotate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        move({key: e.key});
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [move]);
  
  useInterval(() => {
    drop();
  }, dropTime);
  
  const togglePause = () => {
    if (!gameOver) {
      setIsPaused(!isPaused);
    }
  }

  const handleMobileInput = (action: 'left' | 'right' | 'down' | 'rotate' | 'drop') => {
    if (gameOver || isPaused) return;
    switch(action) {
      case 'left':
        movePlayer(-1);
        break;
      case 'right':
        movePlayer(1);
        break;
      case 'down':
        drop();
        break;
      case 'rotate':
        playerRotate(board);
        break;
      case 'drop':
        hardDrop();
        break;
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 md:p-4">
      <Card className="w-full max-w-sm md:max-w-4xl mb-2 md:mb-4 bg-card/80 backdrop-blur-sm border-white/10">
        <CardContent className="flex flex-row justify-around gap-4 p-3">
          <StatusDisplay icon={<Trophy size={20}/>} label="Score" value={score} />
          <StatusDisplay icon={<Layers size={20}/>} label="Rows" value={rows} />
          <StatusDisplay icon={<Star size={20}/>} label="Level" value={level} />
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full max-w-sm md:max-w-4xl">
        <div className="flex-grow flex flex-col items-center w-full">
          <div className="relative w-full max-w-[80vw] sm:max-w-[40vh] md:max-w-none">
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
        </div>
        <div className="w-full md:w-48 flex flex-col gap-4">
          
          <div className="md:hidden flex flex-row gap-4 w-full">
              <Card className="flex-1 bg-card/80 backdrop-blur-sm border-white/10">
                  <CardHeader>
                      <CardTitle className="text-lg text-center">Next</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <NextPiece tetromino={nextTetromino} />
                  </CardContent>
              </Card>
              <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-2">
                  {gameOver ? (
                      <Button onClick={startGame} size="lg" className="w-full">
                      <Play className="mr-2 h-4 w-4" /> Start
                      </Button>
                  ) : (
                      <>
                      <Button onClick={togglePause} variant="secondary" className="flex-1 aspect-square h-14">
                          {isPaused ? <Play/> : <Pause/>}
                      </Button>
                      <Button onClick={startGame} variant="secondary" className="flex-1 aspect-square h-14">
                          <RefreshCw />
                      </Button>
                      </>
                  )}
                  </div>
              </div>
          </div>

          <Card className="hidden md:block bg-card/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                  <CardTitle className="text-lg">Next Piece</CardTitle>
              </CardHeader>
              <CardContent>
                  <NextPiece tetromino={nextTetromino} />
              </CardContent>
          </Card>

          <div className="hidden md:flex flex-col items-center justify-center gap-2">
            {gameOver ? (
              <Button onClick={startGame} size="lg" className="w-full">
                <Play className="mr-2 h-4 w-4" /> Start Game
              </Button>
            ) : (
              <div className="w-full flex gap-2">
                <Button onClick={togglePause} variant="secondary" className="flex-1">
                  {isPaused ? <Play/> : <Pause/>}
                </Button>
                <Button onClick={startGame} variant="secondary" className="flex-1">
                  <RefreshCw /> 
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden mt-4 w-full max-w-xs mx-auto">
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleMobileInput('rotate')} className="w-20 h-20 rounded-full"><ArrowUp size={32}/></Button>
            </div>
            <div className="grid grid-cols-3 grid-rows-2 gap-2">
              <div className="col-start-2 row-start-1 flex justify-center">
                {/* Placeholder for up action if needed */}
              </div>
              <div className="col-start-1 row-start-2 flex justify-center">
                <Button onClick={() => handleMobileInput('left')} className="w-16 h-16 rounded-full"><ArrowLeft size={28}/></Button>
              </div>
              <div className="col-start-2 row-start-2 flex justify-center">
                <Button onClick={() => handleMobileInput('down')} className="w-16 h-16 rounded-full"><ArrowDown size={28}/></Button>
              </div>
              <div className="col-start-3 row-start-2 flex justify-center">
                <Button onClick={() => handleMobileInput('right')} className="w-16 h-16 rounded-full"><ArrowRight size={28}/></Button>
              </div>
            </div>
        </div>
        <div className="mt-4">
            <Button onClick={() => handleMobileInput('drop')} className="w-full h-16 font-bold text-lg">DROP</Button>
        </div>
      </div>
    </div>
  );
}
