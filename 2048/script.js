const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
let score = 0;
let grid = [];

// Initialize the game
function initGame() {
    // Clear existing grid
    gridContainer.innerHTML = '';
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    scoreDisplay.textContent = '0';

    // Create grid cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            gridContainer.appendChild(tile);
        }
    }
    generateTile();
    generateTile();
    updateDisplay();
}

// Generate a new tile
function generateTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({x: i, y: j});
            }
        }
    }
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the display
function updateDisplay() {
    const tiles = document.querySelectorAll('.tile');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            const value = grid[i][j];
            tiles[index].innerHTML = value || '';
            tiles[index].className = 'tile' + (value ? ` tile-${value}` : '');
        }
    }
    scoreDisplay.textContent = score;
}

// Move tiles
function moveTiles(direction) {
    let moved = false;
    const tempGrid = grid.map(row => [...row]);

    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = grid[i];
            if (direction === 'right') row = row.reverse();
            
            // Remove zeros and merge
            row = row.filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            
            // Add zeros back
            while (row.length < 4) row.push(0);
            if (direction === 'right') row = row.reverse();
            
            grid[i] = row;
        }
    } else {
        for (let j = 0; j < 4; j++) {
            let column = grid.map(row => row[j]);
            if (direction === 'down') column = column.reverse();
            
            // Remove zeros and merge
            column = column.filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            
            // Add zeros back
            while (column.length < 4) column.push(0);
            if (direction === 'down') column = column.reverse();
            
            // Update grid
            for (let i = 0; i < 4; i++) {
                grid[i][j] = column[i];
            }
        }
    }

    // Check if anything moved
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] !== tempGrid[i][j]) {
                moved = true;
                break;
            }
        }
    }

    if (moved) {
        generateTile();
        updateDisplay();
    }

    return moved;
}

// Handle key presses
function handleKey(event) {
    event.preventDefault();
    switch (event.key) {
        case 'ArrowUp':
            moveTiles('up');
            break;
        case 'ArrowDown':
            moveTiles('down');
            break;
        case 'ArrowLeft':
            moveTiles('left');
            break;
        case 'ArrowRight':
            moveTiles('right');
            break;
    }
    
    // Check for game over
    if (!canMove()) {
        alert('Game Over! Your score: ' + score);
    }
}

// Check if any moves are possible
function canMove() {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return true;
        }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === grid[i][j + 1]) return true;
            if (grid[j][i] === grid[j + 1][i]) return true;
        }
    }

    return false;
}

// Add event listeners
document.addEventListener('keydown', handleKey);

// Start the game
initGame();
