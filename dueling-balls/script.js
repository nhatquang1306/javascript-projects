const size = 20;
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
document.head.appendChild(styleSheet);

let black, grid, allBallDir;
let button = document.getElementById('start');
let restart = false;
button.addEventListener('click', start);
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

function randomizeBallLocations(ballName, add) {
    const ball = document.querySelector(ballName);
    ball.style.top = (Math.floor(Math.random() * size) * 10) + 'px';
    ball.style.left = (Math.floor(Math.random() * (size / 2)) * 10 + add) + 'px';
}

function randomizeBallDirections(ballDir) {
    for (let i = 0; i < 2; i++) {
        while (ballDir[i] == 0) {
            ballDir[i] = (Math.floor(Math.random() * 21) - 10) / 10;
        }
    }
    let ballDist = Math.sqrt(ballDir[0] * ballDir[0] + ballDir[1] * ballDir[1]);
    ballDir[0] = parseFloat((ballDir[0] * 3 / ballDist).toFixed(2));
    ballDir[1] = parseFloat((ballDir[1] * 3 / ballDist).toFixed(2));
}

function start() {
    restart = true;
    document.querySelectorAll('.black-cell').forEach(e => {
        e.remove();
    });
    document.querySelectorAll('.white-cell').forEach(e => {
        e.remove();
    });
    fillBoard();
    black = size * size / 2;
    allBallDir = [[0, 0], [0, 0], [0, 0], [0, 0]];
    for (let i = 0; i <= 3; i++) {
        randomizeBallLocations('.ball-' + (i + 1), (i % 2 == 1 ? size * 5 : 0));
        randomizeBallDirections(allBallDir[i]);
    }
    setTimeout(() => {
        restart = false;
        progress();
    }, 1000);
}

function progress() {
    if (black <= 0 || black >= size * size || restart) {
        return;
    }
    moveBall(allBallDir[0], 'black-cell', 'white-cell', 1);
    moveBall(allBallDir[1], 'white-cell', 'black-cell', 2);
    moveBall(allBallDir[2], 'black-cell', 'white-cell', 3);
    moveBall(allBallDir[3], 'white-cell', 'black-cell', 4);
    setTimeout(() => {
        progress();
    }, 10);
}

function getCell(x, y) {
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
    if (x < 0 || x >= size || y < 0 || y >= size) {
        return undefined;
    }
    return grid[x][y];
}

function moveBall(ballDir, cur, other, number) {
    const ball = document.querySelector('.ball-' + number);
    let top = parseFloat(ball.style.top);
    let left = parseFloat(ball.style.left);
    let nextTop = top + ballDir[0];
    let nextBottom = nextTop + 10;
    let nextLeft = left + ballDir[1];
    let nextRight = nextLeft + 10;
    let verCell = getCell(ballDir[0] > 0 ? nextBottom : nextTop, (nextLeft + nextRight) / 2);
    let horCell = getCell((nextTop + nextBottom) / 2, ballDir[1] > 0 ? nextRight : nextLeft);
    const list = [];
    if (verCell == undefined || verCell == other) {
        let cellTop = (ballDir[0] > 0 ? Math.ceil(top / 10) : Math.floor(top / 10)) * 10;
        let dist = cellTop - top;
        let percentage = Math.round(dist * 100 / ballDir[0]);
        list.push([percentage, cellTop, undefined]);
        list.push([100, cellTop - (nextTop - cellTop), undefined]);
        if (verCell == other) {
            let x = Math.floor(ballDir[0] > 0 ? nextBottom / 10 : nextTop / 10);
            let y = Math.floor((nextLeft + nextRight) / 20);
            let cell = document.getElementById(x + '-' + y);
            grid[x][y] = cur;
            cell.className = cur;
            if (cur == 'black-cell') {
                black++;
            } else {
                black--;
            }
        }
        ballDir[0] *= -1;
    }
    if (horCell == undefined || horCell == other) {
        let cellLeft = (ballDir[1] > 0 ? Math.ceil(left / 10) : Math.floor(left / 10)) * 10;
        let dist = cellLeft - left;
        let percentage = Math.round(dist * 100 / ballDir[1]);
        let arr = list.find(a => a[0] == percentage);
        if (arr) {
            arr[2] = cellLeft;
        } else {
            list.push([percentage, undefined, cellLeft]);
        }
        arr = list.find(a => a[0] == 100)
        if (arr) {
            arr[2] = cellLeft - (nextLeft - cellLeft)
        } else {
            list.push([100, undefined, cellLeft - (nextLeft - cellLeft)]);
        }  
        if (horCell == other) {
            let x = Math.floor((nextTop + nextBottom) / 20);
            let y = Math.floor(ballDir[1] > 0 ? nextRight / 10 : nextLeft / 10);
            let cell = document.getElementById(x + '-' + y);
            grid[x][y] = cur;
            cell.className = cur;
            if (cur == 'black-cell') {
                black++;
            } else {
                black--;
            }
        }
        ballDir[1] *= -1;
    }
    if (list.length == 0) {
        ball.style.top = nextTop + 'px';
        ball.style.left = nextLeft + 'px';
    } else {
        list.sort((a, b) => a[0] - b[0]);
        if (list[list.length - 1][1] == undefined) {
            list[list.length - 1][1] = nextTop;
        } else if (list[list.length - 1][2] = undefined) {
            list[list.length - 1][2] = nextLeft;
        }
        let keyframes = `@keyframes ${'pattern-' + number} {`
        list.forEach(arr => {
            keyframes += `${arr[0]}% {`;
            if (arr[1] != undefined) {
                keyframes += ('top: ' + arr[1]);
                if (arr[2] != undefined) {
                    keyframes += ', ';
                }
            }
            if (arr[2] != undefined) {
                keyframes += ('left: ' + arr[2]);
            }
            keyframes += '}; ';
        });
        keyframes += '};';
        styleSheet.innerText = keyframes;
        ball.offsetHeight;
    }
}