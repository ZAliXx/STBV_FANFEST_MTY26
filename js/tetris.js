const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;

let SIZE = Math.floor(canvas.clientWidth / COLS) || 24;

const scoreElement   = document.getElementById("score");
const modal          = document.getElementById("modalGameOver");
const puntajeFinal   = document.getElementById("puntajeFinal");

let score = 0;
let jugando = true;

const board = [];
for (let y = 0; y < ROWS; y++) {
    board[y] = new Array(COLS).fill(0);
}

const colors = [
    "",
    "#ff5ca8",
    "#b09ab8",
    "#d65f99",
    "#ffb3d9",
    "#c76ca0",
    "#f7d4ea",
    "#e78bb7"
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
    return { x: 3, y: 0, shape };
}

let current = randomPiece();

function resizeCanvas() {
    const w = canvas.clientWidth;
    SIZE = Math.floor(w / COLS);
    canvas.width  = SIZE * COLS;
    canvas.height = SIZE * ROWS;
    drawBoard();
}

window.addEventListener("resize", resizeCanvas);

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const value = board[y][x];
            drawSquare(x, y, value ? colors[value] : "#1a1a1a");
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
                const nx = current.x + x;
                const ny = current.y + y;
                if (nx < 0 || nx >= COLS || ny >= ROWS || (board[ny] && board[ny][nx]))
                    return true;
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

function gameOver() {
    jugando = false;
    puntajeFinal.textContent = score;
    modal.classList.remove("oculto");
}

function drop() {
    if (!jugando) return;
    current.y++;
    if (collide()) {
        current.y--;
        merge();
        clearLines();
        current = randomPiece();
        if (collide()) {
            gameOver();
            return;
        }
    }
    drawBoard();
}

function rotatePiece() {
    if (!jugando) return;
    const rows = current.shape.length;
    const cols = current.shape[0].length;
    const rotated = [];
    for (let x = 0; x < cols; x++) {
        rotated[x] = [];
        for (let y = rows - 1; y >= 0; y--) {
            rotated[x][rows - 1 - y] = current.shape[y][x];
        }
    }
    const prev = current.shape;
    current.shape = rotated;
    if (collide()) current.shape = prev;
    drawBoard();
}

document.addEventListener("keydown", e => {
    if (!jugando) return;
    if (e.key === "ArrowLeft")  { current.x--; if (collide()) current.x++; drawBoard(); }
    if (e.key === "ArrowRight") { current.x++; if (collide()) current.x--; drawBoard(); }
    if (e.key === "ArrowDown")  { drop(); }
    if (e.key === "ArrowUp")    { rotatePiece(); }
});

document.getElementById("left").onclick   = () => { if (!jugando) return; current.x--; if (collide()) current.x++; drawBoard(); };
document.getElementById("right").onclick  = () => { if (!jugando) return; current.x++; if (collide()) current.x--; drawBoard(); };
document.getElementById("down").onclick   = () => drop();
document.getElementById("rotate").onclick = () => rotatePiece();

document.getElementById("restart").onclick  = () => location.reload();
document.getElementById("menu").onclick     = () => window.location.href = "../index.html";
document.getElementById("btnReiniciar").onclick = () => location.reload();

window.addEventListener("load", () => {
    resizeCanvas();
    setInterval(drop, 600);
});