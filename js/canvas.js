var unitsOnBoard = [[], [], [], [], [], [], [], []];

class Board {
    constructor() {
        this.canvas = document.getElementById("chessBoard");
        this.ctx = this.canvas.getContext("2d");
    }
}

Board.prototype.fieldColor = function (row, col) {
    const boardColors = [
        ['lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey'],
        ['#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555'],
        ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
        ['#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555'],
        ['lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey', '#555555', 'lightgrey']
    ];
    return boardColors[row][col];
}

Board.prototype.showField = function (x, y) {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.fieldColor(y, x);
    if (selectedUnit !== undefined && getSelectedUnitPosition()[0] === y && getSelectedUnitPosition()[1] === x) {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(x * 100, y * 100, 100, 100);
    } else if (unitsOnBoard[y].length > 0 && unitsOnBoard[y][x] !== undefined &&
        unitsOnBoard[y][x] === true) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x * 100, y * 100, 100, 100);
    } else if (this.fieldColor(y, x) === 'white') {
        this.ctx.rect(x * 100, y * 100, 100, 100);
        this.ctx.stroke();
    } else {
        this.ctx.fillRect(x * 100, y * 100, 100, 100);
        this.ctx.closePath();
    }
    this.ctx.closePath();

    if (unitsOnBoard[y].length > 0 && unitsOnBoard[y][x] !== undefined && unitsOnBoard[y][x] != true) {
        this.showUnit(x, y);
    }
}

Board.prototype.showUnit = function (x, y) {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x * 100 + 5, y * 100 + 5, 90, 5);
    let healthPercent = unitsOnBoard[y][x].health / (unitsOnBoard[y][x].maxHealth / 100);
    this.ctx.fillStyle = healthPercent > 100 / 3 ? 'green' : 'red';
    let gaugePercent = (88 / 100) * healthPercent;
    this.ctx.fillRect(x * 100 + 6, y * 100 + 6, gaugePercent, 3);
    this.ctx.closePath();

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x * 100 + gaugePercent + 6, y * 100 + 6, 88 - gaugePercent, 3);
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle = (unitsOnBoard[y][x].owner === 0 ? 'red' : 'blue');
    this.ctx.font = "72px 'Titan One'";
    this.ctx.fillText(unitsOnBoard[y][x].constructor.name.substring(0, 1), x * 100 + 24, y * 100 + 70);
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle = (unitsOnBoard[y][x].owner === 0 ? 'red' : 'blue');
    this.ctx.font = "12px 'Titan One'";
    this.ctx.fillText(unitsOnBoard[y][x].constructor.name, x * 100 + 49 - unitsOnBoard[y][x].constructor.name.length * 3.7, y * 100 + 85);
    this.ctx.closePath();
}

Board.prototype.show = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 900, 700);
    this.ctx.closePath();
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            this.showField(j, i);
            if (availableFields[i][j] === true) {
                this.showAvailableField(j, i);
                if (unitsOnBoard[i].length > 0 && unitsOnBoard[i][j] !== undefined && unitsOnBoard[i][j] != true) {
                    this.showUnit(j, i);
                }
            }
        }
    }
}

Board.prototype.showAvailableField = function (x, y) {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#3e8f40';
    this.ctx.fillRect(x * 100 + 1, y * 100 + 1, 100 - 2, 100 - 2);
    this.ctx.closePath();
}


Board.prototype.hideForbiddenFields = function () {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            if ((activePlayer === 0 && i > 1) || (activePlayer === 1 && i < 5)) {
                this.ctx.beginPath();
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(j * 100, i * 100, 100, 100);
                this.ctx.closePath();
            } else {
                this.showField(j, i);
            }
        }
    }
}

var board = new Board();

