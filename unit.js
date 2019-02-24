var availableFields = [[], [], [], [], [], [], [], []];
var activePlayer = 0;
var stage = 0;
var selectedUnit;
var action;

class Unit {
    constructor(atack, shield, health, atackingSquares, speed) {
        this.atack = atack;
        this.shield = shield;
        this.health = health;
        this.atackingSquares = atackingSquares;
        this.speed = speed;
        this.owner = activePlayer;
    }
}

class Knight extends Unit {
    constructor() {
        super(8, 3, 15, 1, 1);
    }
}

class Elf extends Unit {
    constructor() {
        super(5, 1, 10, 3, 3);
    }
}

class Dwarf extends Unit {
    constructor() {
        super(6, 2, 12, 2, 2);
    }
}

function changeActivePlayer() {
    activePlayer = activePlayer === 0 ? 1 : 0;
}

function fieldIsFree(x, y) {
    return unitsOnBoard[y][x] === undefined;
}

function fieldIsInAvailableRows(y) {
    return (activePlayer === 0 && (y === 0 || y === 1)) || (activePlayer === 1 && (y === 5 || y === 6));
}

function getSelectedUnitPosition() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            if (selectedUnit === unitsOnBoard[i][j]) {
                var position = [];
                position[0] = i;
                position[1] = j;
                return position;
            }
        }
    }
}


function showAvailableFieldsForMove() {
    board.show();
    var position = this.getSelectedUnitPosition();

    for (let i = 0; i < selectedUnit.speed; i++) {
        if (position[1] - i > 0 && unitsOnBoard[position[0]][position[1] - i - 1] === undefined &&
            (selectedUnit instanceof Knight || selectedUnit instanceof Elf || (selectedUnit instanceof Dwarf && unitsOnBoard[position[0]][position[1] - 1] === undefined))) {
            availableFields[position[0]][position[1] - i - 1] = true;
        }
        if (position[1] + i < 9 && unitsOnBoard[position[0]][position[1] + i + 1] === undefined &&
            (selectedUnit instanceof Knight || selectedUnit instanceof Elf || (selectedUnit instanceof Dwarf && unitsOnBoard[position[0]][position[1] + 1] === undefined))) {
            availableFields[position[0]][position[1] + i + 1] = true;
        }
        if (position[0] - i > 0 && unitsOnBoard[position[0] - i - 1][position[1]] === undefined &&
            (selectedUnit instanceof Knight || selectedUnit instanceof Elf || (selectedUnit instanceof Dwarf && unitsOnBoard[position[0] - 1][position[1]] === undefined))) {
            availableFields[position[0] - i - 1][position[1]] = true;
        }
        if (position[0] + i < 7 && unitsOnBoard[position[0] + i + 1][position[1]] === undefined &&
            (selectedUnit instanceof Knight || selectedUnit instanceof Elf || (selectedUnit instanceof Dwarf && unitsOnBoard[position[0] + 1][position[1]] === undefined))) {
            if (!(selectedUnit instanceof Dwarf && i == 1 && unitsOnBoard[position[0] + i][position[1]] !== undefined)) {
                availableFields[position[0] + i + 1][position[1]] = true;
            }
        }
    }
    if (selectedUnit instanceof Dwarf || selectedUnit instanceof Elf) {
        if (position[0] < 6 && position[1] > 0 && unitsOnBoard[position[0] + 1][position[1] - 1] === undefined &&
            ((selectedUnit instanceof Dwarf && (unitsOnBoard[position[0]][position[1] - 1] === undefined || unitsOnBoard[position[0] + 1][position[1]] === undefined)) ||
                selectedUnit instanceof Elf)) {
            availableFields[position[0] + 1][position[1] - 1] = true;
        }
        if (position[0] < 6 && position[1] < 8 && unitsOnBoard[position[0] + 1][position[1] + 1] === undefined &&
            ((selectedUnit instanceof Dwarf && (unitsOnBoard[position[0]][position[1] + 1] === undefined || unitsOnBoard[position[0] + 1][position[1]] === undefined)) ||
                selectedUnit instanceof Elf)) {
            availableFields[position[0] + 1][position[1] + 1] = true;
        }

        if (position[0] > 0 && position[1] > 0 && unitsOnBoard[position[0] - 1][position[1] - 1] === undefined &&
            ((selectedUnit instanceof Dwarf && (unitsOnBoard[position[0]][position[1] - 1] === undefined || unitsOnBoard[position[0] - 1][position[1]] === undefined)) ||
                selectedUnit instanceof Elf)) {
            availableFields[position[0] - 1][position[1] - 1] = true;
        }
        if (position[0] > 0 && position[1] < 8 && unitsOnBoard[position[0] - 1][position[1] + 1] === undefined &&
            ((selectedUnit instanceof Dwarf && (unitsOnBoard[position[0]][position[1] + 1] === undefined || unitsOnBoard[position[0] - 1][position[1]] === undefined)) ||
                selectedUnit instanceof Elf)) {
            availableFields[position[0] - 1][position[1] + 1] = true;
        }
    }

    if (selectedUnit instanceof Elf) {
        if (position[0] < 6 && position[1] > 0 && unitsOnBoard[position[0] + 1][position[1] - 2] === undefined) {
            availableFields[position[0] + 1][position[1] - 2] = true;
        }

        if (position[0] < 6 && position[1] < 7 && unitsOnBoard[position[0] + 1][position[1] + 2] === undefined) {
            availableFields[position[0] + 1][position[1] + 2] = true;
        }

        if (position[0] < 6 && position[1] > 0 && unitsOnBoard[position[0] + 2][position[1] - 1] === undefined) {
            availableFields[position[0] + 2][position[1] - 1] = true;
        }

        if (position[0] < 6 && position[1] < 7 && unitsOnBoard[position[0] + 1][position[1] + 1] === undefined) {
            availableFields[position[0] + 2][position[1] + 1] = true;
        }


        if (position[0] > 0 && position[1] > 1 && unitsOnBoard[position[0] - 1][position[1] - 2] === undefined){
            availableFields[position[0] - 1][position[1] - 2] = true;
        }

        if (position[0] > 0 && position[1] < 7 && unitsOnBoard[position[0] - 1][position[1] + 2] === undefined) {
            availableFields[position[0] - 1][position[1] + 2] = true;
        }

        if (position[0] > 1 && position[1] > 0 && unitsOnBoard[position[0] - 2][position[1] - 1] === undefined) {
            availableFields[position[0] - 2][position[1] - 1] = true;
        }

        if (position[0] > 1 && position[1] < 7 && unitsOnBoard[position[0] - 2][position[1] + 1] === undefined) {
            availableFields[position[0] - 2][position[1] + 1] = true;
        }


    }

    board.show();
}


function clearSelection() {
    selectedUnit = undefined;
    availableFields = [[], [], [], [], [], [], [], []];
    board.show();
}

board.canvas.addEventListener("click", function (e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= board.canvas.offsetLeft;
    x = Math.floor(x / 100);
    x = x > 0 ? x : 0;

    y -= board.canvas.offsetTop;
    y = Math.floor(y / 100);
    if (stage === 0) {
        var selectedRadio = getSelectedRadio();
        if (selectedRadio) {
            if (!fieldIsFree(x, y)) {
                alert('The field must be empty!');
                return;
            }

            if (!fieldIsInAvailableRows(y)) {
                alert('You can not put figures in the red fields!');
                return;
            }
            switch (selectedRadio) {
                case 'knight':
                    unitsOnBoard[y][x] = new Knight();
                    break;
                case 'elf':
                    unitsOnBoard[y][x] = new Elf();
                    break;
                case 'dwarf':
                    unitsOnBoard[y][x] = new Dwarf();
                    break;
            }

            changeActivePlayer();
            if (numUnits('Dwarf', 0) === 2 && numUnits('Dwarf', 1) === 2 &&
                numUnits('Elf', 0) === 2 && numUnits('Elf', 1) === 2 &&
                numUnits('Knight', 0) === 2 && numUnits('Knight', 1) === 2) {
                stage = 1;
                board.show();
            } else {
                board.hideForbiddenFields();
                showMenuPutUnits();
            }
        }
    } else if (stage === 1) {
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                clearSelection();
            }
        };

        document.getElementsByName('unit')[0].addEventListener('change', function () {
            action = getSelectedRadio();
            if (action === 'atack') {
                board.showAvailableFieldsForAtack();
            }
        });
        document.getElementsByName('unit')[1].addEventListener('change', function () {
            action = getSelectedRadio();
            if (action === 'move') {
                showAvailableFieldsForMove();
            }
        });
        if (unitsOnBoard[y][x] !== undefined && unitsOnBoard[y][x].owner === activePlayer &&
            selectedUnit === undefined) {
            action = getSelectedRadio();
            selectedUnit = unitsOnBoard[y][x];
            if (action !== undefined && action === 'move') {
                showAvailableFieldsForMove();
            }
        }

        if (action == 'move' && availableFields[y][x] === true && selectedUnit != undefined && selectedUnit.owner == activePlayer) {
            for (let i = 0; i < unitsOnBoard.length; i++) {
                for (let j = 0; j < unitsOnBoard[0].length; j++) {
                    if (unitsOnBoard[i][j] == selectedUnit) {
                        if (selectedUnit) {
                            unitsOnBoard[y][x] = clone(selectedUnit);
                            unitsOnBoard[i][j] = undefined;
                            availableFields = [[], [], [], [], [], [], [], []];
                            board.show();
                            changeActivePlayer();
                            showMenuActions();
                            selectedUnit = undefined;
                        }
                    }
                }
            }
        }
    }
});

function clone(src) {
    let target;
    switch (src.constructor.name) {
        case 'Dwarf' :
            target = new Dwarf;
            break;
        case 'Elf' :
            target = new Elf;
            break;
        case 'Knight' :
            target = new Knight;
            break;
    }
    for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
            target[prop] = src[prop];
        }
    }
    return target;
}


function getSelectedRadio() {
    var radios = document.getElementsByName('unit');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function numUnits(unitName, activeP) {
    let count = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 9; j++) {
            if (unitsOnBoard[i].length > 0 && unitsOnBoard[i][j] !== undefined &&
                unitsOnBoard[i][j].constructor.name === unitName && unitsOnBoard[i][j].owner === (activeP !== undefined ? activeP : activePlayer)) {
                count++;
            }
        }
    }
    return count;
}

function showAvailableUnitsForPlayer() {
    var text = '';
    for (let i = numUnits('Knight'); i < 2; i++) {
        text += '<label><input type="radio" name="unit" value="knight"> Knight</label><br>\n';
    }

    for (let i = numUnits('Elf'); i < 2; i++) {
        text += '<label><input type="radio" name="unit" value="elf"> Elf</label><br>\n';
    }

    for (let i = numUnits('Dwarf'); i < 2; i++) {
        text += '<label><input type="radio" name="unit" value="dwarf"> Dwarf</label><br>\n';
    }

    return text;
}

function showMenuPutUnits() {
    document.getElementById('menu').innerHTML = 'Player ' + (activePlayer === 0 ? 'A' : 'B') + '<br>';
    document.getElementById('menu').innerHTML += showAvailableUnitsForPlayer();
}

function showMenuActions() {
    document.getElementById('menu').innerHTML = 'Player ' + (activePlayer === 0 ? 'A' : 'B') + '<br>' +
        '<label><input type="radio" name="unit" value="atack"> Atack</label><br>' +
        '<label><input type="radio" name="unit" value="move" checked> Move</label><br>' +
        '<label><input type="radio" name="unit" value="heal"> Heal</label><br>';
}


// showMenuPutUnits();
// board.hideForbiddenFields();

unitsOnBoard[1][1] = new Knight();
unitsOnBoard[1][2] = new Dwarf();
unitsOnBoard[1][3] = new Knight();
unitsOnBoard[3][5] = new Elf();
unitsOnBoard[1][5] = new Elf();
unitsOnBoard[1][6] = new Dwarf();
activePlayer = 1;

unitsOnBoard[5][0] = new Knight();
unitsOnBoard[5][1] = new Knight();
unitsOnBoard[5][2] = new Elf();
unitsOnBoard[5][3] = new Elf();
unitsOnBoard[4][4] = new Dwarf();
unitsOnBoard[5][5] = new Dwarf();

stage = 1;
activePlayer = 0;

function generateObstacles() {
    var obstacles = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < obstacles; i++) {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 3);
        while (unitsOnBoard[2 + y][x] === true) {
            var x = Math.floor(Math.random() * 9);
            var y = Math.floor(Math.random() * 3);
        }
        unitsOnBoard[2 + y][x] = true;
    }
}


generateObstacles();
showMenuActions();
unitsOnBoard[2][5] = true;
unitsOnBoard[0][6] = true;
unitsOnBoard[1][7] = true;
board.show();