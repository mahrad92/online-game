const socketIo = require("socket.io");
const cors = require("cors");
const { Game } = require("./game");

const games = {};

function config(io) {

    io.on("connection", (socket) => {
      console.log("new client connected");
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    
      socket.on("DICE", (gameId, playerId) => {
        const game = games[gameId];
        game.next(playerId);
        socket.broadcast.emit("UPDATE", game);
        socket.emit("UPDATE", game)
      });
    
      socket.on("CREATE_GAME", (gameId, playerId) => {
        if (!games[gameId]) {
          const game = new Game(gameId, playerId);
          games[gameId] = game;
          socket.broadcast.emit("UPDATE", game);
          socket.emit("UPDATE", game)
        }
      });
    
      socket.on("START_GAME", (gameId, playerId) => {
        const game = games[gameId];
        game.start();
        socket.broadcast.emit("UPDATE", game);
        socket.emit("UPDATE", game)
      });
    
      socket.on("JOIN_GAME", (gameId, playerId) => {
        const game = games[gameId];
        game.addPlayer(playerId);
        socket.broadcast.emit("UPDATE", game);
        socket.emit("UPDATE", game)
      });
    
      socket.on("LIST_GAMES", () => {
        socket.emit("LIST_GAMES", games);
      });
    
      socket.emit("LIST_GAMES", games);
    });
}

module.exports = config;
