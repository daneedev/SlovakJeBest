
const boardSize = 12;
const mineCount = 15;
const board = document.getElementById('board');

board.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;
board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;

const cells = [];
for (let i = 0; i < boardSize; i++) {
    cells[i] = [];
    for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        board.appendChild(cell);
        cells[i][j] = cell;
    }
}

let placedMines = 0;
while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!cells[row][col].classList.contains('mine')) {
        cells[row][col].classList.add('mine');
        placedMines++;
    }
}

function countMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (cells[newRow][newCol].classList.contains('mine')) {
                    count++;
                }
            }
        }
    }
    return count;
}

function clearNeighboringTiles(row, col) {
    const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1]
    ];

    for (const [r, c] of neighbors) {
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            const cell = cells[r][c];
            if (!cell.classList.contains('clicked') && !cell.classList.contains('mine')) {
                cell.classList.add('clicked');
                const mineCount = countMines(r, c);
                if (mineCount === 0) {
                    clearNeighboringTiles(r, c);
                } else {
                    cell.textContent = mineCount;
                }
            }
        }
    }
}

function checkWinCondition() {
    let flaggedMines = 0;
    let totalFlagged = 0;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (cells[i][j].classList.contains('mine') && cells[i][j].classList.contains('flagged')) {
                flaggedMines++;
            }
            if (cells[i][j].classList.contains('flagged')) {
                totalFlagged++;
            }
        }
    }
    if (flaggedMines === mineCount && totalFlagged === mineCount) {
        alert('Congratulations! You win!');
        location.reload();
    }
}

function revealMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (cells[i][j].classList.contains('mine')) {
                cells[i][j].classList.add('revealed');
            }
        }
    }
}

function gameOver() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            cells[i][j].removeEventListener('click', clickHandler);
            cells[i][j].removeEventListener('contextmenu', flagHandler);
        }
    }
    revealMines();
    setTimeout(() => {
        alert('Game over!');
        location.reload();
    }, 1000);  // Delay the alert by 1 second to show the mine images
}

function clickHandler(e) {
    e.preventDefault();
    const cell = this;
    if (cell.classList.contains('flagged')) {
        return;  // Don't reveal flagged tiles
    }
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (cell.classList.contains('mine')) {
        gameOver();
    } else {
        const mineCount = countMines(row, col);
        cell.classList.add('clicked');
        if (mineCount === 0) {
            clearNeighboringTiles(row, col);
        } else {
            cell.textContent = mineCount;
        }
    }
}

function flagHandler(e) {
    e.preventDefault();
    const cell = this;
    if (cell.classList.contains('clicked')) {
        return;  // Don't flag revealed tiles
    }
    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
    } else {
        cell.classList.add('flagged');
    }
    checkWinCondition();
}

for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        cells[i][j].addEventListener('click', clickHandler);
        cells[i][j].addEventListener('contextmenu', flagHandler);  // Right click event
    }
}

// Toggle dark mode
document.getElementById("toggleThemeBtn").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
