const tunnels = {
  4: 25,
  13: 46,
  27: 5,
  21: 3,
  33: 49,
  42: 63,
  43: 18,
  50: 69,
  54: 31,
  62: 81,
  67: 45,
  74: 92,
  76: 58,
  89: 53,
  99: 41,
};

class Game {
  get currentPlayer() {
    return this.players[this.index];
  }

  addPlayer(userId) {
    if (
      this.status == "INIT" &&
      this.players.every((p) => p.id !== userId) &&
      this.players.length < 4
    ) {
      this.players.push(new Player(userId));
    }
  }

  start(userId) {
    if (userId == this.ownerId && this.players.length > 1) {
      const colors = ["red", "yellow", "blue", "green"];
      this.players.forEach((p) => {
        p.color = colors.pop();
      });
      this.status = "PROGRESS";
    }
  }

  next() {
    const currentPlayer = this.Players[this.index];
    const steps = Math.floor(Math.random() * 6);
    if (currentPlayer.status == "live") {
      currentPlayer.cell = currentPlayer.cell + steps;
      checkTunnel(currentPlayer);
    }
    if (dice != 6) {
      this.index++;
      if (this.index == this.players.length) {
        this.index = 0;
      }
    } else if (currentPlayer.status == "dead") {
      currentPlayer.status = "live";
      currentPlayer.cell = 1;
    }
  }

  getState() {
    return JSON.stringify(this);
  }

  checkTunnel() {
    const tunnel = tunnels[this.currentPlayer.cell];
    if (tunnel) {
      this.currentPlayer.cell = tunnel;
      return "Tunnel Happens";
    }
    return "";
  }
  constructor(id, ownerId) {
    this.id = id;
    this.owner = ownerId;
    this.status = "INIT";
    this.index = 0;
    this.players=[]
    this.addPlayer(ownerId)
  }
}

class Player {
  color = null;
  cell = 0;
  constructor(id) {
    this.id = id;
  }
}

module.exports = {
  Game,
  Player,
};
