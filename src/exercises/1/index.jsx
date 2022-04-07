import { useState } from 'react';

const initialBoard = () => [
  ['.', '.', '.'],
  ['.', '.', '.'],
  ['.', '.', '.'],
];
const rowLen = 3;
const colLen = 3;
const findPlayerToMoveNext = (move) => (move % 2 ? '0' : 'X');
const findPlayerMovedLast = (move) => (move % 2 ? 'X' : '0');
const didAnyPlayerWin = (board) => {
  // Check for rows
  if (
    (board[0][0] !== '.' &&
      board[0][0] === board[0][1] &&
      board[0][1] === board[0][2]) ||
    (board[1][0] !== '.' &&
      board[1][0] === board[1][1] &&
      board[1][1] === board[1][2]) ||
    (board[2][0] !== '.' &&
      board[2][0] === board[2][1] &&
      board[2][1] === board[2][2])
  ) {
    return true;
  }

  // Check for cols
  if (
    (board[0][0] !== '.' &&
      board[1][0] === board[0][0] &&
      board[2][0] === board[1][0]) ||
    (board[0][1] !== '.' &&
      board[1][1] === board[0][1] &&
      board[2][1] === board[1][1]) ||
    (board[0][2] !== '.' &&
      board[1][2] === board[0][2] &&
      board[2][2] === board[1][2])
  ) {
    return true;
  }

  // Check for diagonals
  if (
    (board[0][0] !== '.' &&
      board[1][1] === board[0][0] &&
      board[2][2] === board[1][1]) ||
    (board[0][2] !== '.' &&
      board[1][1] === board[0][2] &&
      board[2][0] === board[1][1])
  ) {
    return true;
  }

  return false;
};
const getGameStatus = (lastMove, board) => {
  const anyWinner = didAnyPlayerWin(board);
  if (anyWinner) {
    return {
      winner: findPlayerMovedLast(lastMove),
      playerToMoveNext: undefined,
    };
  }
  if (lastMove === 9) {
    return {
      winner: 'Nobody',
      playerToMoveNext: undefined,
    };
  }

  return {
    winner: undefined,
    playerToMoveNext: findPlayerToMoveNext(lastMove),
  };
};

function Board({
  board,
  updateBoard,
  lastPlayedMove,
  setLastPlayedMove,
  selectedMove,
  setSelectedMove,
  gameStatus,
  updateMovesHistory,
}) {
  return (
    <div>
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex}>
            {row.map((item, colIndex) => (
              <button
                key={`${rowIndex} - ${colIndex}`}
                style={{ margin: '20px' }}
                disabled={gameStatus.winner}
                onClick={() => {
                  updateBoard((board) => {
                    board[rowIndex][colIndex] = gameStatus.playerToMoveNext;
                    return board;
                  });
                  setLastPlayedMove((lastPlayedMove) => lastPlayedMove + 1);
                  setSelectedMove((selectedMove) => selectedMove + 1);
                  if (selectedMove !== lastPlayedMove) {
                    updateMovesHistory((movesHistory) => {
                      movesHistory.splice(
                        selectedMove + 1,
                        movesHistory.length - selectedMove,
                        { rowIndex, colIndex }
                      );
                      return movesHistory;
                    });
                  } else {
                    updateMovesHistory((movesHistory) => {
                      movesHistory.push({ rowIndex, colIndex });
                      return movesHistory;
                    });
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function One() {
  const [board, updateBoard] = useState(initialBoard);
  const [lastPlayedMove, setLastPlayedMove] = useState(0);
  const [selectedMove, setSelectedMove] = useState(0);
  const [movesHistory, updateMovesHistory] = useState([{}]);

  const gameStatus = getGameStatus(selectedMove, board);
  return (
    <div>
      {gameStatus.playerToMoveNext && (
        <span>{`Player ${gameStatus.playerToMoveNext}, your move`}</span>
      )}
      {gameStatus.winner && <span>{`${gameStatus.winner} won`}</span>}
      <Board
        board={board}
        updateBoard={updateBoard}
        lastPlayedMove={lastPlayedMove}
        setLastPlayedMove={setLastPlayedMove}
        selectedMove={selectedMove}
        setSelectedMove={setSelectedMove}
        gameStatus={gameStatus}
        updateMovesHistory={updateMovesHistory}
      />
      <div style={{ margin: '10px' }}>
        {movesHistory.map((_, index) => {
          return (
            <button
              key={`move-${index}`}
              disabled={index === selectedMove}
              style={{ marginRight: '5px' }}
              onClick={() => {
                updateBoard((board) => {
                  board = initialBoard();
                  movesHistory.slice(0, index + 1).forEach((move, index) => {
                    if (
                      move.rowIndex !== undefined &&
                      move.colIndex !== undefined
                    ) {
                      board[move.rowIndex][move.colIndex] =
                        findPlayerMovedLast(index);
                    }
                  });
                  return board;
                });
                setSelectedMove(index);
              }}
            >
              {index}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => {
          setLastPlayedMove(0);
          setSelectedMove(0);
          updateBoard(initialBoard);
          updateMovesHistory([{}]);
        }}
      >
        Restart
      </button>
    </div>
  );
}

export default One;
