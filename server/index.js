const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { Game, Player } = require("./game");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    // this is the address of the react client
    origin: "http://localhost:3000",
  },
});
require("./socket")(io);
server.listen(port, () => console.log(`Listening on port ${port}`));
