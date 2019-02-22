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

Board.prototype.show = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 900, 700);
    this.ctx.closePath();
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.fieldColor(i, j);
            if (unitsOnBoard[i].length > 0 && unitsOnBoard[i][j] !== undefined &&
                unitsOnBoard[i][j] === true) {
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(j * 100, i * 100, 100, 100);
                this.ctx.closePath();
            } else if (this.fieldColor(i, j) === 'white') {
                this.ctx.rect(j * 100, i * 100, 100, 100);
                this.ctx.stroke();
            } else {
                this.ctx.fillRect(j * 100, i * 100, 100, 100);
                this.ctx.closePath();
            }
            if (unitsOnBoard[i].length > 0 && unitsOnBoard[i][j] !== undefined && unitsOnBoard[i][j] !== true) {
                this.ctx.beginPath();
                this.ctx.fillStyle = (unitsOnBoard[i][j].owner === 0 ? 'red' : 'blue');
                this.ctx.font = "72px Arial";
                this.ctx.fillText(unitsOnBoard[i][j].constructor.name.substring(0, 1), j * 100 + 20, i * 100 + 70);
                this.ctx.closePath();
            }
        }
    }

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            if (availableFields[i][j] === true) {
                this.showAvailableField(j, i);
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

            if ((activePlayer === 0 && i > 1) || activePlayer === 1 && i < 5) {
                // alert();
                this.ctx.beginPath();
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(j * 100, i * 100, 100, 100);
                this.ctx.closePath();
            } else {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.fieldColor(i, j);
                if (this.fieldColor(i, j) === 'white') {
                    this.ctx.rect(j * 100, i * 100, 100, 100);
                    this.ctx.stroke();
                } else {
                    this.ctx.fillRect(j * 100, i * 100, 100, 100);
                    this.ctx.closePath();
                }
                if (unitsOnBoard[i].length > 0 && unitsOnBoard[i][j] !== undefined) {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = (unitsOnBoard[i][j].owner === 0 ? 'red' : 'blue');
                    this.ctx.font = "72px Arial";
                    this.ctx.fillText(unitsOnBoard[i][j].constructor.name.substring(0, 1), j * 100 + 20, i * 100 + 70);
                    this.ctx.closePath();
                }
            }
        }
    }
}


var board = new Board();
