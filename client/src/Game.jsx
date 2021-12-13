import { useState, useEffect } from "react";
import { v4 } from "uuid";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:4001");
const userId = v4();

function App() {
  const [games, setGames] = useState({});
  const [cGame, setcGame] = useState({});

  const listGamesHandler = (payload) => {
    console.log(11, payload);
    setGames(payload);
  };
  const updateGameHandler = (payload) => {
    console.log(games);
    setcGame(payload);
  };

  useEffect(() => {
    if (cGame.id) {
      setGames({ ...games, [cGame.id]: cGame });
    }
  }, [cGame]);
  useEffect(() => {
    // this reacts to an incoming message
    socket.on("LIST_GAMES", listGamesHandler);
    socket.on("UPDATE", updateGameHandler);
  }, []);

  return (
    <div className="App">
      <p>{userId}</p>
      <button
        onClick={() => {
          let gameId = prompt("Please enter a name for Game", "");
          socket.emit("CREATE_GAME", gameId, userId);
        }}
      >
        create Game
      </button>
      <ul>
        {Object.values(games).map((g) => (
          <li key={g.id}>
            {g.players.find((p) => p.id == userId) && g.players.length > 1 ? (
              <button
                onClick={() => {
                  socket.emit("START_GAME", g.id, userId);
                }}
              >
                start
              </button>
            ) : (
              <button
                onClick={() => {
                  socket.emit("JOIN_GAME", g.id, userId);
                }}
              >
                join {g.id}
              </button>
            )}
            <p>players: {g.players.map((p) => p.id).join(" , ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
