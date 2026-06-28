const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const SIZE = 24;

const scoreElement = document.getElementById("score");

let score = 0;

const board = [];
for (let y = 0; y < ROWS; y++) {
    board[y] = [];
    for (let x = 0; x < COLS; x++) {
        board[y][x] = 0;
    }
}

const colors = [
    "",
    "#ff5ca8",
    "silver",
    "#ff0000",
    "#ff99cc",
    "#888",
    "#ffffff",
    "#ff2d55"
];

const pieces = [
    [[1, 1, 1, 1]],
    [[2, 0, 0], [2, 2, 2]],
    [[0, 0, 3], [3, 3, 3]],
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0]],
    [[6, 6, 0], [0, 6, 6]],
    [[0, 7, 0], [7, 7, 7]]
];

function randomPiece() {
    const shape = pieces[Math.floor(Math.random() * pieces.length)];
    return { x: 3, y: 0, shape: shape };
}

let current = randomPiece();

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const value = board[y][x];
            drawSquare(x, y, value ? colors[value] : "#202020");
        }
    }
    current.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) drawSquare(current.x + x, current.y + y, colors[value]);
        });
    });
}

function collide() {
    for (let y = 0; y < current.shape.length; y++) {
        for (let x = 0; x < current.shape[y].length; x++) {
            if (current.shape[y][x]) {
                const newX = current.x + x;
                const newY = current.y + y;
                if (
                    newX < 0 ||
                    newX >= COLS ||
                    newY >= ROWS ||
                    (board[newY] && board[newY][newX])
                ) return true;
            }
        }
    }
    return false;
}

function merge() {
    current.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) board[current.y + y][current.x + x] = value;
        });
    });
}

function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(v => v)) {
            board.splice(y, 1);
            board.unshift(new Array(COLS).fill(0));
            score += 100;
            scoreElement.textContent = score;
            y++;
        }
    }
}

function drop() {
    current.y++;
    if (collide()) {
        current.y--;
        merge();
        clearLines();
        current = randomPiece();
        if (collide()) {
            alert("GAME OVER");
            location.reload();
        }
    }
    drawBoard();
}

function rotatePiece() {
    const rows = current.shape.length;
    const cols = current.shape[0].length;
    const rotated = [];
    for (let x = 0; x < cols; x++) {
        rotated[x] = [];
        for (let y = rows - 1; y >= 0; y--) {
            rotated[x][rows - 1 - y] = current.shape[y][x];
        }
    }
    const prevShape = current.shape;
    current.shape = rotated;
    if (collide()) current.shape = prevShape;
    drawBoard();
}


document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  { current.x--; if (collide()) current.x++; }
    if (e.key === "ArrowRight") { current.x++; if (collide()) current.x--; }
    if (e.key === "ArrowDown")  { drop(); return; }
    if (e.key === "ArrowUp")    { rotatePiece(); return; }
    drawBoard();
});

document.getElementById("left").onclick   = () => { current.x--; if (collide()) current.x++; drawBoard(); };
document.getElementById("right").onclick  = () => { current.x++; if (collide()) current.x--; drawBoard(); };
document.getElementById("down").onclick   = () => drop();
document.getElementById("rotate").onclick = () => rotatePiece();

document.getElementById("restart").onclick = () => location.reload();
document.getElementById("menu").onclick    = () => window.location.href = "../index.html";

setInterval(drop, 600);
drawBoard();