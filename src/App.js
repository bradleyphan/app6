import React, { useState, useEffect, StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { createRoot } from 'react-dom/client';


function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}


function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }


    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }


    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}
function HomePage() {
  return <div>Welcome to the Home Page!
    Click on "Tic-Tac-Toe" to play or click on "API Page" to find the weather!
  </div>;
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];


    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }


    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }


    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });


    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}


function TicTacToePage() {
    return <Game />;
}


function APIPage() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);


  const apiKey = '49b10374bdcf41afae552842232211';


  function fetchWeather() {
      if (!location) {
          alert('Please enter a location.');
          return;
      }


      setLoading(true);
      fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`)
          .then(response => response.json())
          .then(data => {
              setWeather(data);
              setLoading(false);
          })
          .catch(error => {
              console.error('Error fetching weather data:', error);
              setLoading(false);
          });
  }


  return (
      <div>
          <h2>Weather Fetcher</h2>
          <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
          />
          <button onClick={fetchWeather}>Get Weather</button>


          {loading && <div>Loading weather data...</div>}
         
          {weather && (
              <div>
                  <h3>Weather in {weather.location.name}, {weather.location.region}</h3>
                  <p>Temperature: {weather.current.temp_c} °C / {weather.current.temp_f} °F</p>
                  <p>Condition: {weather.current.condition.text}</p>
                  <img src={weather.current.condition.icon} alt="Weather Icon" />
              </div>
          )}
      </div>
  );
}


function App() {
    return (
        <BrowserRouter>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/tictactoe">Tic-Tac-Toe</Link></li>
                    <li><Link to="/api">API Page</Link></li>
                </ul>
            </nav>


            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tictactoe" element={<TicTacToePage />} />
                <Route path="/api" element={<APIPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;


const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);




