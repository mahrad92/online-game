const tunnels = {
    '1,4': 21,
    '2,8': 33,
    '4,8': 16,
    '5,2': 21,
    '5,10': 19,
    '7,2': 19,
    '8,7': 18,
    '4,1': -37,
    '5,3': -25,
    '3,7': -22,
    '7,6': -21,
    '6,7': -23,
    '8,5': -18,
    '9,9': -36,
    '10,2': -58
}

class player {
    constructor(col, row, ctx, imgStr, clr) {
        this.ctx = ctx;
        this.col = col;
        this.row = row;
        this.direction = "R";
        this.status = "notInPlay";
        this.type = clr;
        this.color = "red";
        if (clr.endsWith("B")) this.color = "blue";
        if (clr.endsWith("G")) this.color = "green";
        if (clr.endsWith("Y")) this.color = "yellow";
        if (clr.endsWith("R")) this.color = "red";
        //type:playerB,playerY,playerR,playerG
        //status:notInPlay/waiting/playing
    }
    draw() {
        if (this.status == "playing")
            this.ctx.drawImage(this.img, this.col, this.row, 30, 30);
    }
    canMove(chance) {
        console.log("row", this.row, "col:", this.col, chance);
        if (this.row < 50 && this.col - 50 * chance < 0) {
            return false;
        } else return true;
    }

    moveBack() {
        this.ctx.clearRect(this.col - 5, this.row - 5, 45, 45);
        if (this.direction == "L") {
            if (this.col + 50 < 500) this.col = this.col + 50;
            else if (this.row + 50 > 0) {
                this.row = this.row + 50;
                this.direction = "R";
            }
        } else {
            if (this.col - 50 > 0) this.col = this.col - 50;
            else if (this.row + 50 > 0) {
                this.row = this.row + 50;
                this.direction = "L";
            }
        }
        this.draw();
    }

    move() {
        this.ctx.clearRect(this.col - 5, this.row - 5, 45, 45);
        if (this.direction == "R") {
            if (this.col + 50 < 500) this.col = this.col + 50;
            else if (this.row - 50 > 0) {
                this.row = this.row - 50;
                this.direction = "L";
            }
        } else {
            if (this.col - 50 > 0) this.col = this.col - 50;
            else if (this.row - 50 > 0) {
                this.row = this.row - 50;
                this.direction = "R";
            }
        }
        this.draw();
    }
    checkWin() {
        if (this.col < 50 && this.row < 50) {
            return true;
        }
    }
    moveTunel() {
        let x = Math.ceil(this.col / 50);
        let y = 11 - Math.ceil(this.row / 50);
        const steps = tunnels[y + "," + x] || 0;
        for (let i = 1; i <= Math.abs(steps); i++) {
            if (steps > 0) {
                this.move();
            } else {
                this.moveBack();
            }
        }
    }
    choose(p) {
        document.getElementById(p + "c").setAttribute("style", "display: none;");
        document.getElementById(p).setAttribute("style", "display: compact;");
        this.status = "waiting";
    }
    start(imgPlayer, p) {
        this.status = "playing";
        document.getElementById(p).setAttribute("style", "display: none;");
        var img = new Image();
        img.style.display = "none";
        img.src = imgPlayer;
        this.img = img;
        document.body.appendChild(img);
        img.onload = () => {
            this.img = img;
            this.draw();
        };
    }
    iskilled() {
        document
            .getElementById(this.type)
            .setAttribute("style", "display: compact;");
        this.status = "waiting";
        this.col = 8;
        this.row = 459;
    }
}

var drawGrid = function (w, h, ctx) {
    var ctx;
    var img = document.getElementById("snakeundladder");
    if (!img.complete) {
        img.onload = () => {
            drawGrid(w, h, ctx);
        };
    }
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    for (let x = 0; x <= w; x += 50) {
        for (let y = 0; y <= h; y += 50) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }
};

class dice {
    constructor() {
        this.platformElement = document.getElementById("platform");
        this.diceElement = document.getElementById("dice");
        this.diceResultElement = document.getElementById("result");
    }
    setDice(player) {
        this.diceResultElement.style.backgroundColor = player.color;
        this.platformElement.classList.add("playing");
        this.platformElement.classList.remove("stop");

        this.chance = Math.floor(Math.random() * 6 + 1);

        setTimeout(() => {
            this.platformElement.classList.add("stop");
            this.platformElement.classList.remove("playing");
            this.diceResultElement.innerText = this.chance;
            var x = 0,
                y = 20,
                z = -20;
            switch (this.chance) {
                case 1:
                    x = 0;
                    y = 20;
                    z = -20;
                    break;
                case 2:
                    x = -100;
                    y = -150;
                    z = 10;
                    break;
                case 3:
                    x = 0;
                    y = -100;
                    z = -10;
                    break;
                case 4:
                    x = 0;
                    y = 100;
                    z = -10;
                    break;
                case 5:
                    x = 80;
                    y = 120;
                    z = -10;
                    break;
                case 6:
                    x = 0;
                    y = 200;
                    x = 10;
                    break;
            }

            this.diceElement.style.transform =
                "rotateX(" + x + "deg) rotateY(" + y + "deg) rotateZ(" + z + "deg)";
            this.platformElement.style.transform = "translate3d(0,0, 0px)";
        }, 1000);

        return this.chance;
    }
    drawDice() {
        this.ctx.drawImage(this.img, 0, 0, 40, 40);
    }
}
// run codes when document loaded
window.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("myCanvas").getContext("2d");
    drawGrid(500, 500, ctx);
    const dice1 = new dice();
    let MoveSteps = 0;
    let players = [];
    document.getElementById("playerBc").addEventListener("click", () => {
        let x = new player(8, 459, ctx, "playerB.png", "playerB");
        x.choose("playerB");
        players.push(x);
    });
    document.getElementById("playerYc").addEventListener("click", () => {
        let x = new player(8, 459, ctx, "playerY.png", "playerY");
        x.choose("playerY");
        players.push(x);
    });
    document.getElementById("playerGc").addEventListener("click", () => {
        let x = new player(8, 459, ctx, "playerG.png", "playerG");
        x.choose("playerG");
        players.push(x);
    });
    document.getElementById("playerRc").addEventListener("click", () => {
        let x = new player(8, 459, ctx, "playerR.png", "playerR");
        x.choose("playerR");
        players.push(x);
    });
    function getPlayer() {
        let x = players.shift();
        players.push(x);
        return x;
    }
    function gift() {
        let x = players.pop();
        players.unshift(x);
    }
    function findCollision(currentPlayer) {
        let killedPlayer = players.filter(
            (p) =>
                p.col == currentPlayer.col &&
                p.row == currentPlayer.row &&
                p.type !== currentPlayer.type
        );
        {
            if (killedPlayer[0] !== undefined) {
                killedPlayer[0].iskilled();
                alert(killedPlayer[0].type + "iskilled");
            }
        }
    }
    document.getElementById("platform").addEventListener("click", () => {
        let currentPlayer = getPlayer();
        MoveSteps = dice1.setDice(currentPlayer);
        MoveSteps = document.getElementById("inpt").value || MoveSteps;
        setTimeout(() => {
            if (currentPlayer.status == "playing") {
                document.getElementById("lbld").innerHTML =
                    currentPlayer.type + " moved " + MoveSteps + "steps!";
                if (currentPlayer.canMove(MoveSteps)) {
                    for (let i = 1; i <= MoveSteps; i++) {
                        currentPlayer.move();
                    }
                }
                currentPlayer.moveTunel();
                drawGrid(500, 500, ctx);
                findCollision(currentPlayer);
                players.forEach((p) => p.draw());
                //currentPlayer.draw();
                if (currentPlayer.checkWin()) {
                    alert(`player${currentPlayer.type} **DU HAST GEWONNEN`);
                }
            } else if (MoveSteps != 6 && currentPlayer.status == "waiting") {
                document.getElementById("lbld").innerHTML =
                    "Sorry " + currentPlayer.type + "! you can not start. Wait for 6 ";
            } else if (MoveSteps == 6 && currentPlayer.status == "waiting") {
                document.getElementById("lbld").innerHTML =
                    "Congarajulation " +
                    currentPlayer.type +
                    "!!!, start moving, being careful for snakes and use ladders!";
                currentPlayer.start(currentPlayer.type + ".png", currentPlayer.type);
            }
            if (MoveSteps == 6) {
                gift();
            }
            document.getElementById("next-player").style.backgroundColor =
                players[0].color;
        }, 1000);
    });
});