import React, { useState, useEffect } from "react";
import { Box, Button, Grid, GridItem, Heading, Text } from "@chakra-ui/react";

const Index = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    addRandomTile();
    addRandomTile();
  }, []);

  const addRandomTile = () => {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const newValue = Math.random() < 0.9 ? 2 : 4;
      const newBoard = [...board];
      newBoard[row][col] = newValue;
      setBoard(newBoard);
    }
  };

  const moveLeft = () => {
    let moved = false;
    const newBoard = board.map((row) => {
      const newRow = row.filter((cell) => cell !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          setScore((prevScore) => prevScore + newRow[i]);
          moved = true;
        }
      }
      return newRow.concat(Array(4 - newRow.length).fill(0));
    });
    if (moved) {
      setBoard(newBoard);
      addRandomTile();
    }
  };

  const moveRight = () => {
    let moved = false;
    const newBoard = board.map((row) => {
      const newRow = row.filter((cell) => cell !== 0).reverse();
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          setScore((prevScore) => prevScore + newRow[i]);
          moved = true;
        }
      }
      return Array(4 - newRow.length)
        .fill(0)
        .concat(newRow.reverse());
    });
    if (moved) {
      setBoard(newBoard);
      addRandomTile();
    }
  };

  const moveUp = () => {
    let moved = false;
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let col = 0; col < 4; col++) {
      const newCol = board.map((row) => row[col]).filter((cell) => cell !== 0);
      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
          setScore((prevScore) => prevScore + newCol[i]);
          moved = true;
        }
      }
      newCol.concat(Array(4 - newCol.length).fill(0)).forEach((cell, i) => {
        newBoard[i][col] = cell;
      });
    }
    if (moved) {
      setBoard(newBoard);
      addRandomTile();
    }
  };

  const moveDown = () => {
    let moved = false;
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let col = 0; col < 4; col++) {
      const newCol = board
        .map((row) => row[col])
        .filter((cell) => cell !== 0)
        .reverse();
      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
          setScore((prevScore) => prevScore + newCol[i]);
          moved = true;
        }
      }
      Array(4 - newCol.length)
        .fill(0)
        .concat(newCol.reverse())
        .forEach((cell, i) => {
          newBoard[i][col] = cell;
        });
    }
    if (moved) {
      setBoard(newBoard);
      addRandomTile();
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const isGameOver = board.every((row) => row.every((cell) => cell !== 0 && !canMerge(board)));
    setGameOver(isGameOver);
  }, [board]);

  const canMerge = (board) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if ((col < 3 && board[row][col] === board[row][col + 1]) || (row < 3 && board[row][col] === board[row + 1][col])) {
          return true;
        }
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    setScore(0);
    setGameOver(false);
    addRandomTile();
    addRandomTile();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" onKeyDown={handleKeyDown} tabIndex="0">
      <Heading as="h1" size="xl" mb={4}>
        2048
      </Heading>
      <Text fontSize="xl" mb={4}>
        Score: {score}
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={2} mb={4}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GridItem key={`${rowIndex}-${colIndex}`} bg={getCellColor(cell)} display="flex" alignItems="center" justifyContent="center" fontSize="2xl" fontWeight="bold" color="white" borderRadius="md" height="100px">
              {cell !== 0 && cell}
            </GridItem>
          )),
        )}
      </Grid>
      {gameOver && (
        <Box textAlign="center">
          <Text fontSize="2xl" mb={4}>
            Game Over!
          </Text>
          <Button onClick={resetGame} colorScheme="blue">
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

const getCellColor = (value) => {
  switch (value) {
    case 2:
      return "gray.300";
    case 4:
      return "gray.400";
    case 8:
      return "orange.300";
    case 16:
      return "orange.400";
    case 32:
      return "orange.500";
    case 64:
      return "red.300";
    case 128:
      return "red.400";
    case 256:
      return "red.500";
    case 512:
      return "yellow.300";
    case 1024:
      return "yellow.400";
    case 2048:
      return "yellow.500";
    default:
      return "gray.100";
  }
};

export default Index;
