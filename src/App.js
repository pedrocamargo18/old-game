import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ campo1, campo2, xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? campo1 : campo2;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Vencedor: ${winner}`
    : `Próximo movimento: ${xIsNext ? campo1 : campo2}`;

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {Array(3)
            .fill(null)
            .map((_, col) => {
              const index = row * 3 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                />
              );
            })}
        </div>
      ))}
    </>
  );
}

function Popup({ winner, isDraw, onClose }) {
  const gifUrl = isDraw
    ? "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2VibmQycDJwM3pwa252MjZwOG12bHF3NTVpdDk2dWMyNHVyc3JrcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2WGDUTmsB4DzFuvZ2t/giphy.webp" // Empate
    : winner === "X"
    ? "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTJkbHV0bHZqaGt4aGxtdGp3YXQ4OThrdXNoa3V4cW1kbnR2bWN0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tPo9rksWnfPo4HS/giphy.webp" // Vitória X
    : "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzExYXVndG8xNWhiOHBxc204eHJxMzR2enYyN2ljY3A1d3FjaHZvcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BFZYfubkyrXKWT324x/giphy.webp"; // Vitória O

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{isDraw ? "Empate!" : `Vencedor: ${winner}`}</h2>
        <img src={gifUrl} alt={isDraw ? "Empate" : `Vencedor: ${winner}`} />
        <button className="close-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [campo1, setCampo1] = useState("");
  const [campo2, setCampo2] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const winner = calculateWinner(nextSquares);
    const isDraw = !winner && nextSquares.every((square) => square);

    if (winner || isDraw) {
      setWinner(winner);
      setIsDraw(isDraw);
      setShowPopup(true);
    }

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setShowPopup(false);
    setWinner(null);
    setIsDraw(false);
  }

  return (
    <div className="game">
      <div className="flex flex-row content-center ml-5">
        <input
          id="campo1"
          maxLength="1"
          value={campo1}
          onChange={(e) => setCampo1(e.target.value.toUpperCase())}
          placeholder="Jogador 1"
          className="block w-32 rounded-md bg-white px-3 py-1.5  text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <input
          id="campo2"
          maxLength="1"
          value={campo2}
          onChange={(e) => setCampo2(e.target.value.toUpperCase())}
          placeholder="Jogador 2"
          className="block w-32 rounded-md bg-white px-3 py-1.5  text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
      </div>
      <Board
        campo1={campo1 || "X"}
        campo2={campo2 || "O"}
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
      />
      <div className="game-info">
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move === 0 ? "Início do Jogo" : `Ir para movimento #${move}`}
              </button>
            </li>
          ))}
        </ol>
      </div>
      {showPopup && (
        <Popup
          winner={winner}
          isDraw={isDraw}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
