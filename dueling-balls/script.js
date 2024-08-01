const time = 15;
let styles = [];
let size, grid, ballDirs, ballPositions, blackBalls, whiteBalls;
let isRestarted = false;
const coefs = [[10, 0, 10, 0], [10, 0, 0, 10], [0, 10, 10, 0]];
const restartButton = document.getElementById('restart');
restartButton.addEventListener('click', start);
start();

function fillBoard() {
    const box = document.querySelector(".box");
    box.style.width = (size * 10) + 'px';
    box.style.height = (size * 10) + 'px';
    grid = [];
    for (let i = 0; i < size; i++) {
        grid.push([]);
        for (let j = 0; j < size; j++) {
            const div = document.createElement("div");
            if (j < size / 2) {
                div.className = "black-cell";
                grid[i].push('black-cell');
            } else {
                div.className = "white-cell";
                grid[i].push('white-cell');
            }
            div.id = i + '-' + j;
            box.appendChild(div);
        }
    }
}

function randomize(box, name, i) {
    randomizeBallLocations(name == 'black-ball' ? size * 5 : 0);
    const ball = document.createElement('div');
    ball.className = name;
    ball.id = `ball-${i + 1}`;
    ball.style.top = ballPositions[i][0] + 'px';
    ball.style.left = ballPositions[i][1] + 'px';
    randomizeBallDirections();
    box.appendChild(ball);
}

function randomizeBallLocations(add) {
    const ballPosition = [
        (Math.floor(Math.random() * (size - 2)) + 1) * 10,
        (Math.floor(Math.random() * (size / 2 - 2)) + 1) * 10 + add
    ];
    ballPositions.push(ballPosition);
}

function randomizeBallDirections() {
    const ballDir = [0, 0];
    for (let i = 0; i < 2; i++) {
        while (ballDir[i] == 0) {
            ballDir[i] = (Math.floor(Math.random() * 21) - 10) / 10;
        }
    }
    const ballDist = Math.sqrt(ballDir[0] * ballDir[0] + ballDir[1] * ballDir[1]);
    ballDir[0] = Math.round(ballDir[0] * 300 / ballDist) / 100;
    ballDir[1] = Math.round(ballDir[1] * 300 / ballDist) / 100;
    ballDirs.push(ballDir);
}

function start() {
    restartButton.disabled = true;
    isRestarted = true;
    document.querySelectorAll('.black-cell').forEach(e => {
        e.remove();
    });
    document.querySelectorAll('.white-cell').forEach(e => {
        e.remove();
    });
    document.querySelectorAll('.black-ball').forEach(e => {
        e.remove();
    });
    document.querySelectorAll('.white-ball').forEach(e => {
        e.remove();
    });
    size = parseInt(document.getElementById('grid-size').value);
    if (isNaN(size)) size = 20;
    else if (size < 6) size = 6;
    else if (size > 50) size = 50;
    else if (size % 2 == 1) size++;
    fillBoard();
    blackBalls = parseInt(document.getElementById('black-ball-count').value);
    if (isNaN(blackBalls)) blackBalls = 2;
    else if (blackBalls < 0) blackBalls = 0;
    else if (blackBalls > 10) blackBalls = 10;
    whiteBalls = parseInt(document.getElementById('white-ball-count').value);
    if (isNaN(whiteBalls)) whiteBalls = 2;
    else if (whiteBalls < 0) whiteBalls = 0;
    else if (whiteBalls > 10) whiteBalls = 10;
    ballDirs = [];
    ballPositions = [];
    const box = document.querySelector('.box');
    for (let i = 0; i < blackBalls; i++) {
        randomize(box, 'black-ball', i);
    }
    for (let i = blackBalls; i < blackBalls + whiteBalls; i++) {
        randomize(box, 'white-ball', i);
    }
    for (const styleSheet of styles) {
        document.head.removeChild(styleSheet);
    }
    styles = [];
    for (let i = 0; i < blackBalls + whiteBalls; i++) {
        let styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        document.head.appendChild(styleSheet);
        styles.push(styleSheet);
    }
    setTimeout(() => {
        for (let i = 1; i <= blackBalls + whiteBalls; i++) {
            const ball = document.getElementById(`ball-${i}`);
            ball.style.removeProperty('top');
            ball.style.removeProperty('left');
        }
        restartButton.disabled = false;
        isRestarted = false;
        progress();
    }, 500);
}

function progress() {
    if (isRestarted) {
        return;
    }
    for (let i = 0; i < blackBalls; i++) {
        moveBall(ballPositions[i], ballDirs[i], 'white-cell', 'black-cell', i + 1);
    }
    for (let i = blackBalls; i < blackBalls + whiteBalls; i++) {
        moveBall(ballPositions[i], ballDirs[i], 'black-cell', 'white-cell', i + 1);
    }
    setTimeout(() => {
        progress();
    }, time);
}

function getCell(x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) {
        return undefined;
    }
    return grid[x][y];
}

function moveBall(ballPosition, ballDir, cur, other, number) {
    const ball = document.getElementById('ball-' + number);
    const top = ballPosition[0];
    const left = ballPosition[1];
    const nextTop = Math.round((top + ballDir[0]) * 100) / 100;
    const nextLeft = Math.round((left + ballDir[1]) * 100) / 100;
    const x = Math.floor((ballDir[0] > 0 ? top + 10 : top) / 10);
    const y = Math.floor((ballDir[1] > 0 ? left + 10 : left) / 10);
    const higherX = x + Math.sign(ballDir[0]);
    const higherY = y + Math.sign(ballDir[1]);
    const nextCells = [];
    for (let i = 0; i < 3; i++) {
        const coef = coefs[i];
        const nextX = Math.floor((ballDir[0] > 0 ? nextTop + coef[0] : nextTop + coef[1]) / 10);
        const nextY = Math.floor((ballDir[1] > 0 ? nextLeft + coef[2] : nextLeft + coef[3]) / 10);
        const nextCell = getCell(nextX, nextY);
        if ((nextX == higherX || nextY == higherY) && (nextCell == other || nextCell == undefined)) {
            nextCells.push([nextX, nextY, i]);
        }
    }
    const list = [[0, top, left], [100, nextTop, nextLeft]];
    let diaLocation = null;
    let reverseX = false, reverseY = false;
    for (const cell of nextCells) {
        const nextX = cell[0];
        const nextY = cell[1];
        if (nextX == higherX && nextY == higherY) {
            diaLocation = cell;
        } else if (nextX == higherX) {
            collision(1, list, cell, x * 10, top, nextTop, ballDir[0], cur);
            reverseX = true;
        } else {
            collision(2, list, cell, y * 10, left, nextLeft, ballDir[1], cur);
            reverseY = true;
        }
    }
    if (!reverseX && !reverseY && diaLocation != null) {
        collisionDiaCell(list, diaLocation, x * 10, y * 10, ballDir, top, left, nextTop, nextLeft, cur);
        reverseX = true;
        reverseY = true;
    }
    if (reverseX) ballDir[0] *= -1;
    if (reverseY) ballDir[1] *= -1;
    list.sort((a, b) => a[0] - b[0]);
    makeKeyframes(list, number, ball);
    const last = list[list.length - 1];
    ballPosition[0] = last[1];
    ballPosition[1] = last[2];
}

function collision(index, list, cell, cellLimit, firstPosition, nextPosition, direction, cur) {
    const nextX = cell[0];
    const nextY = cell[1];
    const percentage = Math.round((cellLimit - firstPosition) * 10000 / direction) / 100;
    const location = list.find(c => c[0] == percentage);
    if (location) {
        location[index] = cellLimit;
    } else {
        list.push([percentage, undefined, undefined]);
        list[list.length - 1][index] = cellLimit;
    }
    list[1][index] = Math.round((cellLimit * 2 - nextPosition) * 100) / 100;
    if (getCell(nextX, nextY) != undefined) {
        document.getElementById(nextX + '-' + nextY).className = cur;
        grid[nextX][nextY] = cur;
    }
}

function collisionDiaCell(list, diaLocation, cellTop, cellLeft, ballDir, top, left, nextTop, nextLeft, cur) {
    const nextX = diaLocation[0];
    const nextY = diaLocation[1];
    const percentTop = Math.round((cellTop - top) * 10000 / ballDir[0]) / 100;
    const percentLeft = Math.round((cellLeft - left) * 10000 / ballDir[1]) / 100;
    const location = [0, 0, 0];
    if (percentTop < percentLeft) {
        location[0] = percentTop;
        location[1] = cellTop;
        cellLeft = left + percentTop * ballDir[1] / 100;
        location[2] = cellLeft;
    } else {
        location[0] = percentLeft;
        cellTop = top + percentLeft * ballDir[0] / 100;
        location[1] = cellTop;
        location[2] = cellLeft;
    }
    if (location[0] != 0 && location[0] != 100) {
        list.push(location);
    }
    list[1][1] = Math.round((cellTop * 2 - nextTop) * 100) / 100;
    list[1][2] = Math.round((cellLeft * 2 - nextLeft) * 100) / 100;
    if (getCell(nextX, nextY) != undefined) {
        document.getElementById(nextX + '-' + nextY).className = cur;
        grid[nextX][nextY] = cur;
    }
}

function makeKeyframes(list, number, ball) {
    let keyframes = `@keyframes ${'pattern-' + number} { `;
    list.forEach(arr => {
        keyframes += `${arr[0]}% {`;
        if (arr[1] != undefined) {
            keyframes += (' top: ' + arr[1] + 'px;');
        }
        if (arr[2] != undefined) {
            keyframes += (' left: ' + arr[2] + 'px;');
        }
        keyframes += ' } ';
    });
    keyframes += '}';
    styles[number - 1].innerText = keyframes;
    ball.style.animation = 'none';
    ball.offsetHeight;
    ball.style.animation = `pattern-${number} ${time}ms linear forwards`;
}