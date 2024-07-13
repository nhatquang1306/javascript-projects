const size = 20;
let ball1Dir, ball2Dir;
fillBoard(size);
randomizeBallLocations(size);
start(size);

function fillBoard(size) {
    const box = document.querySelector(".box");
    box.style.width = (size * 10) + 'px';
    box.style.height = (size * 10) + 'px';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const div = document.createElement("div");
            if (j < size / 2) {
                div.className = "black-cell";
            } else {
                div.className = "white-cell";
            }
            div.id = (i * 10) + '-' + (j * 10);
            box.appendChild(div);
        }
    }
}

function randomizeBallLocations(size) {
    const ball1 = document.querySelector(".ball-1");
    ball1.style.top = (Math.floor(Math.random() * size) * 10) + 'px';
    ball1.style.left = (Math.floor(Math.random() * (size / 2)) * 10) + 'px';
    const ball2 = document.querySelector(".ball-2");
    ball2.style.top = (Math.floor(Math.random() * size) * 10) + 'px';
    ball2.style.left = (Math.floor(Math.random() * (size / 2)) * 10 + size * 5) + 'px';
}

function start(size) {
    black = size * size / 2;
    white = size * size / 2;
    ball1Dir = [Math.random() >= 0.5 ? 10 : -10, Math.random() >= 0.5 ? 10 : -10];
    ball2Dir = [Math.random() >= 0.5 ? 10 : -10, Math.random() >= 0.5 ? 10 : -10];
    progress(size);
}

function progress(size) {
    let time = 0;
    let arr1 = moveBall(size, ball1Dir, "black-cell", "white-cell", ".ball-1");
    let arr2 = moveBall(size, ball2Dir, "white-cell", "black-cell", ".ball-2");
    if (arr1 != null && arr2 != null) {
        time = 50;
        arr1[0].style.top = arr1[1];
        arr1[0].style.left = arr1[2];
        arr2[0].style.top = arr2[1];
        arr2[0].style.left = arr2[2];
    }
    setTimeout(() => {
        progress(size);
    }, time);
}

function moveBall(size, ballDir, cur, other, ballName) {
    const ball = document.querySelector(ballName);
    let top = parseFloat(ball.style.top);
    let left = parseFloat(ball.style.left);
    let nextTop = top + ballDir[0];
    let nextLeft = left + ballDir[1];
    let checkDia = true;
    if (nextTop < 0 || nextTop >= size * 10 - 10) {
        ballDir[0] *= -1;
        checkDia = false;
    } else {
        let cell = document.getElementById(nextTop + '-' + left);
        if (cell.className == other) {
            ballDir[0] *= -1;
            cell.className = cur;
            checkDia = false;
        }
    }
    if (nextLeft < 0 || nextLeft >= size * 10 - 10) {
        ballDir[1] *= -1;
        checkDia = false;
    } else {
        let cell = document.getElementById(top + '-' + nextLeft);
        if (cell.className == other) {
            ballDir[1] *= -1;
            cell.className = cur;
            checkDia = false;
        }
    }
    if (checkDia) {
        let cell = document.getElementById(nextTop + '-' + nextLeft);
        if (cell.className == other) {
            ballDir[0] *= -1;
            ballDir[1] *= -1;
            cell.className = cur;
        } else {
            return [ball, nextTop + 'px', nextLeft + 'px'];
        }
    }
    return null;
}