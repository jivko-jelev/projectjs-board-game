availableFields = [[], [], [], [], [], [], []];
var activePlayer = 0;
var stage = 0;
var roundNumber = 1;
var score = [0, 0];
var selectedUnit;
var action = 'atack';
var destroyedUnits = [];
destroyedUnits[0] = [];
destroyedUnits[1] = [];

board.hideForbiddenFields();

class Unit {
    constructor(atack, shield, health, atackingSquares, speed) {
        this.atack = atack;
        this.shield = shield;
        this.health = health;
        this.maxHealth = health;
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
    selectedUnit = undefined;
    board.show();
    roundNumber++;
    showMenuActions();
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
    if (selectedUnit === undefined) {
        return;
    }
    var position = this.getSelectedUnitPosition();

    for (let i = 0; i < selectedUnit.speed; i++) {
        if (position[1] - i > 0 && unitsOnBoard[position[0]][position[1] - i - 1] === undefined &&
            (unitsOnBoard[position[0]][position[1] - 1] === undefined)) {
            availableFields[position[0]][position[1] - i - 1] = true;
        }
        if (position[1] + i < 8 && unitsOnBoard[position[0]][position[1] + i + 1] === undefined &&
            (unitsOnBoard[position[0]][position[1] + 1] === undefined)) {
            availableFields[position[0]][position[1] + i + 1] = true;
        }
        if (position[0] - i > 0 && unitsOnBoard[position[0] - i - 1][position[1]] === undefined &&
            (unitsOnBoard[position[0] - 1][position[1]] === undefined)) {
            availableFields[position[0] - i - 1][position[1]] = true;
        }
        if (position[0] + i < 7 && unitsOnBoard[position[0] + i + 1][position[1]] === undefined &&
            (unitsOnBoard[position[0] + 1][position[1]] === undefined)) {
            if (!(selectedUnit instanceof Dwarf && i == 1 && unitsOnBoard[position[0] + i][position[1]] !== undefined)) {
                availableFields[position[0] + i + 1][position[1]] = true;
            }
        }
        if (i === 1) {
            break;
        }
    }

    if (selectedUnit instanceof Dwarf || selectedUnit instanceof Elf) {
        if (position[0] < 6 && position[1] > 0 && unitsOnBoard[position[0] + 1][position[1] - 1] === undefined &&
            (unitsOnBoard[position[0]][position[1] - 1] === undefined || unitsOnBoard[position[0] + 1][position[1]] === undefined)) {
            availableFields[position[0] + 1][position[1] - 1] = true;
        }
        if (position[0] < 6 && position[1] < 8 && unitsOnBoard[position[0] + 1][position[1] + 1] === undefined &&
            (unitsOnBoard[position[0]][position[1] + 1] === undefined || unitsOnBoard[position[0] + 1][position[1]] === undefined)) {
            availableFields[position[0] + 1][position[1] + 1] = true;
        }

        if (position[0] > 0 && position[1] > 0 && unitsOnBoard[position[0] - 1][position[1] - 1] === undefined &&
            (unitsOnBoard[position[0]][position[1] - 1] === undefined || unitsOnBoard[position[0] - 1][position[1]] === undefined)) {
            availableFields[position[0] - 1][position[1] - 1] = true;
        }
        if (position[0] > 0 && position[1] < 8 && unitsOnBoard[position[0] - 1][position[1] + 1] === undefined &&
            (unitsOnBoard[position[0]][position[1] + 1] === undefined || unitsOnBoard[position[0] - 1][position[1]] === undefined)) {
            availableFields[position[0] - 1][position[1] + 1] = true;
        }
    }

    if (selectedUnit instanceof Elf) {
        if (position[1] > 2 && unitsOnBoard[position[0]][position[1] - 3] === undefined &&
            unitsOnBoard[position[0]][position[1] - 1] === undefined && unitsOnBoard[position[0]][position[1] - 2] === undefined) {
            availableFields[position[0]][position[1] - 3] = true;
        }
        if (position[1] < 6 && unitsOnBoard[position[0]][position[1] + 3] === undefined &&
            unitsOnBoard[position[0]][position[1] + 1] === undefined && unitsOnBoard[position[0]][position[1] + 2] === undefined) {
            availableFields[position[0]][position[1] + 3] = true;
        }
        if (position[0] > 2 && unitsOnBoard[position[0] - 3][position[1]] === undefined &&
            unitsOnBoard[position[0] - 1][position[1]] === undefined && unitsOnBoard[position[0] - 2][position[1]] === undefined) {
            availableFields[position[0] - 3][position[1]] = true;
        }
        if (position[0] < 5 && unitsOnBoard[position[0] + 3][position[1]] === undefined &&
            unitsOnBoard[position[0] + 1][position[1]] === undefined && unitsOnBoard[position[0] + 2][position[1]] === undefined) {
            availableFields[position[0] + 3][position[1]] = true;
        }


        if (unitsOnBoard[position[0] + 1][position[1] - 2] === undefined &&
            ((unitsOnBoard[position[0]][position[1] - 1] === undefined && unitsOnBoard[position[0]][position[1] - 2] === undefined) ||
                // (unitsOnBoard[position[0]][position[1] - 1] === undefined && unitsOnBoard[position[0] + 1][position[1] - 1] === undefined) ||
                (unitsOnBoard[position[0] + 1][position[1]] === undefined && unitsOnBoard[position[0] + 1][position[1] - 1] === undefined))) {
            availableFields[position[0] + 1][position[1] - 2] = true;
        }

        if (unitsOnBoard[position[0] + 1][position[1] + 2] === undefined &&
            ((unitsOnBoard[position[0]][position[1] + 1] === undefined && unitsOnBoard[position[0]][position[1] + 2] === undefined) ||
                (unitsOnBoard[position[0] + 1][position[1]] === undefined && unitsOnBoard[position[0] + 1][position[1] + 1] === undefined))) {
            availableFields[position[0] + 1][position[1] + 2] = true;
        }

        if (position[0] < 6 && position[1] > 0 && unitsOnBoard[position[0] + 2][position[1] - 1] === undefined &&
            ((unitsOnBoard[position[0]][position[1] - 1] === undefined && unitsOnBoard[position[0] + 1][position[1] - 1] === undefined) ||
                (unitsOnBoard[position[0] + 1][position[1]] === undefined && unitsOnBoard[position[0] + 2][position[1]] === undefined))) {
            availableFields[position[0] + 2][position[1] - 1] = true;
        }

        if (position[0] < 6 && position[1] < 7 && unitsOnBoard[position[0] + 2][position[1] + 1] === undefined &&
            ((unitsOnBoard[position[0]][position[1] + 1] === undefined && unitsOnBoard[position[0] + 1][position[1] + 1] === undefined) ||
                (unitsOnBoard[position[0] + 1][position[1]] === undefined && unitsOnBoard[position[0] + 2][position[1]] === undefined))) {
            availableFields[position[0] + 2][position[1] + 1] = true;
        }

        if (position[0] > 0 && position[1] > 1 && unitsOnBoard[position[0] - 1][position[1] - 2] === undefined &&
            ((unitsOnBoard[position[0]][position[1] - 1] === undefined && unitsOnBoard[position[0]][position[1] - 2] === undefined) ||
                (unitsOnBoard[position[0] - 1][position[1]] === undefined && unitsOnBoard[position[0] - 1][position[1] - 1] === undefined))) {
            availableFields[position[0] - 1][position[1] - 2] = true;
        }

        if (position[0] > 0 && position[1] < 7 && unitsOnBoard[position[0] - 1][position[1] + 2] === undefined &&
            ((unitsOnBoard[position[0] - 1][position[1]] === undefined && unitsOnBoard[position[0] - 1][position[1] + 1] === undefined) ||
                (unitsOnBoard[position[0]][position[1] + 1] === undefined && unitsOnBoard[position[0]][position[1] + 2] === undefined))) {
            availableFields[position[0] - 1][position[1] + 2] = true;
        }

        if (position[0] > 1 && position[1] > 0 && unitsOnBoard[position[0] - 2][position[1] - 1] === undefined &&
            ((unitsOnBoard[position[0]][position[1] - 1] === undefined && unitsOnBoard[position[0] - 1][position[1] - 1] === undefined) ||
                (unitsOnBoard[position[0] - 1][position[1]] === undefined && unitsOnBoard[position[0] - 2][position[1]] === undefined))) {
            availableFields[position[0] - 2][position[1] - 1] = true;
        }

        if (position[0] > 1 && position[1] < 7 && unitsOnBoard[position[0] - 2][position[1] + 1] === undefined &&
            ((unitsOnBoard[position[0]][position[1] + 1] === undefined && unitsOnBoard[position[0] - 1][position[1] + 1] === undefined) ||
                (unitsOnBoard[position[0] - 1][position[1]] === undefined && unitsOnBoard[position[0] - 2][position[1]] === undefined))) {
            availableFields[position[0] - 2][position[1] + 1] = true;
        }
    }

    board.show();
}

function enemy(x, y) {
    return (activePlayer === 1 && unitsOnBoard[y][x].owner === 0) ||
        (activePlayer === 0 && unitsOnBoard[y][x].owner === 1);
}

function canAttack(x, y) {
    if (x >= 0 && x < 9 && y >= 0 && y < 7) {
        if (unitsOnBoard[y][x] !== undefined) {
            if (unitsOnBoard[y][x] === true) {
                return true;
            }
            return unitsOnBoard[y][x] !== undefined && (unitsOnBoard[y][x].constructor.name == 'Dwarf' || unitsOnBoard[y][x].constructor.name == 'Elf' ||
                unitsOnBoard[y][x].constructor.name == 'Knight' || unitsOnBoard[y][x] === true) && enemy(x, y);
        }
    }
}

function fieldIsClearOrWithObstacle(y, x) {
    return y >= 0 && y < 7 && x >= 0 && x < 9 && (unitsOnBoard[y][x] === undefined || unitsOnBoard[y][x] === true);
}

function fieldIsClear(y, x) {
    return y >= 0 && y < 7 && x >= 0 && x < 9 && unitsOnBoard[y][x] === undefined;
}

function showAvailableFieldsForAtack() {
    var position = this.getSelectedUnitPosition();

    if (selectedUnit !== undefined) {

        if (unitsOnBoard[position[0]][position[1]].constructor.name == 'Knight') {
            if (canAttack(position[1], position[0] - 1)) {
                availableFields[position[0] - 1][position[1]] = true;
            }
            if (canAttack(position[1], position[0] + 1)) {
                availableFields[position[0] + 1][position[1]] = true;
            }
            if (canAttack(position[1] - 1, position[0])) {
                availableFields[position[0]][position[1] - 1] = true;
            }
            if (canAttack(position[1] + 1, position[0])) {
                availableFields[position[0]][position[1] + 1] = true;
            }
        } else if (unitsOnBoard[position[0]][position[1]].constructor.name == 'Dwarf') {
            if (fieldIsClear(position[0], position[1] - 1) && canAttack(position[1] - 2, position[0])) {
                availableFields[position[0]][position[1] - 2] = true;
            }

            if (fieldIsClear(position[0] + 1, position[1]) && canAttack(position[1], position[0] + 2)) {
                availableFields[position[0] + 2][position[1]] = true;
            }

            if (fieldIsClear(position[0], position[1] + 1) && canAttack(position[1] + 2, position[0])) {
                availableFields[position[0]][position[1] + 2] = true;
            }

            if (fieldIsClear(position[0] - 1, position[1]) && canAttack(position[1], position[0] - 2)) {
                availableFields[position[0] - 2][position[1]] = true;
            }

        } else if (unitsOnBoard[position[0]][position[1]].constructor.name == 'Elf') {
            if (fieldIsClearOrWithObstacle(position[0], position[1] - 1) && fieldIsClearOrWithObstacle(position[0], position[1] - 2) &&
                canAttack(position[1] - 3, position[0])) {
                availableFields[position[0]][position[1] - 3] = true;
            }

            if (fieldIsClearOrWithObstacle(position[0] + 1, position[1]) && fieldIsClearOrWithObstacle(position[0] + 2, position[1]) &&
                canAttack(position[1], position[0] + 3)) {
                availableFields[position[0] + 3][position[1]] = true;
            }

            if (fieldIsClearOrWithObstacle(position[0], position[1] + 1) && fieldIsClearOrWithObstacle(position[0], position[1] + 2) &&
                canAttack(position[1] + 3, position[0])) {
                availableFields[position[0]][position[1] + 3] = true;
            }

            if (fieldIsClearOrWithObstacle(position[0] - 1, position[1]) && fieldIsClearOrWithObstacle(position[0] - 2, position[1]) &&
                canAttack(position[1], position[0] - 3)) {
                availableFields[position[0] - 3][position[1]] = true;
            }
        }

        board.show();
    }
}


function clearSelection() {
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
                generateObstacles();
                showMenuActions();
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
                selectedUnit = undefined;
                clearSelection();
            }
        };


        document.getElementsByName('unit')[0].addEventListener('change', function () {
            action = getSelectedRadio();
            if (action === 'atack') {
                clearSelection();
                showAvailableFieldsForAtack();
            }
        });
        document.getElementsByName('unit')[1].addEventListener('change', function () {
            action = getSelectedRadio();
            if (action === 'move') {
                clearSelection();
                showAvailableFieldsForMove();
            }
        });
        document.getElementsByName('unit')[2].addEventListener('change', function () {
            action = getSelectedRadio();
            if (action === 'heal') {
                clearSelection();
                selectedUnit = undefined;
                board.show();
                return;
            }
        });
        if (unitsOnBoard[y][x] !== undefined && unitsOnBoard[y][x].owner === activePlayer &&
            selectedUnit === undefined) {
            action = getSelectedRadio();
            selectedUnit = unitsOnBoard[y][x];
            if (action !== undefined && action === 'move') {
                showAvailableFieldsForMove();
            } else if (action !== undefined && action === 'atack') {
                showAvailableFieldsForAtack();
            } else if (action !== undefined && action === 'heal' && selectedUnit.owner == activePlayer) {
                unitHeal(x, y);
                clearSelection();
                board.show();
            }

            return;
        }

        if (action == 'move' && availableFields[y][x] === true && selectedUnit != undefined && selectedUnit.owner == activePlayer) {
            for (let i = 0; i < unitsOnBoard.length; i++) {
                for (let j = 0; j < unitsOnBoard[i].length; j++) {
                    if (unitsOnBoard[i][j] == selectedUnit) {
                        if (selectedUnit) {
                            unitsOnBoard[y][x] = clone(selectedUnit);
                            unitsOnBoard[i][j] = undefined;
                            selectedUnit = undefined;
                            availableFields = [[], [], [], [], [], [], [], []];
                            board.show();
                            changeActivePlayer();
                            showMenuActions();
                        }
                    }
                }
            }
            return;
        }

        if (action == 'atack' && availableFields[y][x] === true && selectedUnit != undefined && selectedUnit.owner == activePlayer) {
            atackUnit(x, y);
            availableFields = [[], [], [], [], [], [], [], []];
            selectedUnit = undefined;
            changeActivePlayer();
            board.show();
            showMenuActions();
            return;
        }

        if (unitsOnBoard[y][x] !== undefined && unitsOnBoard[y][x].owner === activePlayer) {
            selectedUnit = unitsOnBoard[y][x];
            clearSelection();
            if (action !== undefined && action === 'move') {
                showAvailableFieldsForMove();
            } else if (action !== undefined && action === 'atack') {
                showAvailableFieldsForAtack();
            }
            board.show();
        }

    }
});

function unitHeal(x, y) {
    console.log(x + ':' + y);
    console.log(selectedUnit);
    var dice = Math.floor(Math.random() * 6) + 1;
    selectedUnit.health = selectedUnit.health + dice > selectedUnit.maxHealth ? selectedUnit.maxHealth : selectedUnit.health + dice;

    dice = Math.floor(Math.random() * 6) + 1;
    if (!(dice & 1)) {
        changeActivePlayer();
    } else {
        roundNumber++;
    }
}

function throwDice() {
    var dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    document.getElementById('dice').style['display'] = 'inherit';
    document.getElementById('dice-0').innerText = dice[0];
    document.getElementById('dice-1').innerText = dice[1];
    document.getElementById('dice-2').innerText = dice[2];
    return dice;
}

function atackUnit(x, y) {
    if (unitsOnBoard[y][x] === true) {
        unitsOnBoard[y][x] = undefined;
        return;
    }

    var dice = throwDice();

    var damage = selectedUnit.atack - unitsOnBoard[y][x].shield;
    if (unitsOnBoard[y][x].health === dice[0] + dice[1] + dice[2]) {
        alert('Attack is blocked because of the dice!');
        return;
    } else if (dice[0] === 1 && dice[1] === 1 && dice[2] === 1) {
        alert('Half attack because of the dice!');
        damage /= 2;
    }
    unitsOnBoard[y][x].health -= damage;
    score[activePlayer] += damage;
    document.getElementById(`player-${activePlayer}-score`).innerText = `${score[activePlayer]}`;
    if (unitsOnBoard[y][x].health <= 0) {
        destroyedUnits[activePlayer === 0 ? 1 : 0][destroyedUnits[activePlayer === 0 ? 1 : 0].length] = unitsOnBoard[y][x].constructor.name;
        unitsOnBoard[y][x] = undefined;
        var atackedPlayer = activePlayer === 0 ? 1 : 0;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 9; j++) {
                if (unitsOnBoard[i][j] !== undefined && (unitsOnBoard[i][j] instanceof Dwarf ||
                    unitsOnBoard[i][j] instanceof Knight || unitsOnBoard[i][j] instanceof Elf)
                    && unitsOnBoard[i][j].owner === atackedPlayer) {
                    return;
                }
            }
        }
        stage = 2;
        showStatistics();
    }
}

function showStatistics() {
    var statistics = document.getElementById('statistics');
    statistics.style['display'] = 'inherit';
    statistics.innerText = 'Player ' + (activePlayer === 0 ? 'A' : 'B') + ' wins\n\n';
    statistics.innerText += `Rounds: ${roundNumber}\n\n\n`;

    statistics.innerText += 'Player A\n';
    statistics.innerText += `Score: ${score[0]}\n`;
    statistics.innerText += `Losts:\n`;
    for (let i = 0; i < destroyedUnits[0].length; i++) {
        statistics.innerText += `${i + 1}. ${destroyedUnits[0][i]}\n`;
    }

    statistics.innerText += '\n\nPlayer B\n';
    statistics.innerText += `Score: ${score[1]}\n`;
    statistics.innerText += `Losts:\n`;
    for (let i = 0; i < destroyedUnits[1].length; i++) {
        statistics.innerText += `${i + 1}. ${destroyedUnits[1][i]}\n`;
    }
}

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
    var unitIsSelected = false;
    for (let i = numUnits('Knight'); i < 2; i++) {
        text += '<label><input type="radio" name="unit" value="knight" ' + (unitIsSelected === false ? 'checked' : '') + '> Knight</label><br>\n';
        unitIsSelected = true;
    }

    for (let i = numUnits('Elf'); i < 2; i++) {
        text += '<label><input type="radio" name="unit" value="elf" ' + (unitIsSelected === false ? 'checked' : '') + '> Elf</label><br>\n';
        unitIsSelected = true;
    }

    for (let i = numUnits('Dwarf'); i < 2; i++) {
        text += '<label><input type="radio" name="unit" value="dwarf" ' + (unitIsSelected === false ? 'checked' : '') + '> Dwarf</label><br>\n';
        unitIsSelected = true;
    }

    return text;
}

function showMenuPutUnits() {
    document.getElementById('menu').innerHTML = 'Player ' + (activePlayer === 0 ? 'A' : 'B') + '<br>';
    document.getElementById('menu').innerHTML += showAvailableUnitsForPlayer();
}

function showMenuActions() {
    document.getElementById('menu').innerHTML = 'Player ' + (activePlayer === 0 ? 'A' : 'B') + '<br>' +
        '<label><input type="radio" name="unit" value="atack"' + (action == 'atack' ? ' checked' : '') + '> Atack</label><br>' +
        '<label><input type="radio" name="unit" value="move"' + (action == 'move' ? ' checked' : '') + '> Move</label><br>' +
        '<label><input type="radio" name="unit" value="heal"' + (action == 'heal' ? ' checked' : '') + '> Heal</label><br>';
}

showMenuPutUnits();

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

function init(hideForbiddenCells = false) {
    document.getElementById('statistics').style['display'] = 'none';
    board = new Board();
    board.show();
    availableFields = [[], [], [], [], [], [], []];
    unitsOnBoard = [[], [], [], [], [], [], [], []];
    activePlayer = 0;
    stage = 0;
    roundNumber = 1;
    score = [0, 0];
    document.getElementById('player-0-score').innerText = '0';
    document.getElementById('player-1-score').innerText = '0';
    selectedUnit;
    action = 'move';
    board.hideForbiddenFields();
    destroyedUnits = [];
    destroyedUnits[0] = [];
    destroyedUnits[1] = [];
    showMenuPutUnits();
}


init();
document.getElementById('new-game').addEventListener('click', function () {
    init(true);
})