let selectedPiece = null;
let previousColor = "";
let currentPlayer = "white"; // Tracks the current player (white or black)

// Initialize board squares
document.querySelectorAll('.column').forEach((square, index) => {
    square.dataset.row = Math.floor(index / 8);
    square.dataset.col = index % 8;
    square.addEventListener('click', handleSquareClick);
});

function handleSquareClick(event) {
    const square = event.target;

    // If no piece is selected, select a piece
    if (!selectedPiece && square.hasAttribute('data-piece')) {
        if (square.getAttribute('data-piece').includes(currentPlayer)) {
            selectPiece(square);
        } else {
            alert(`It's ${currentPlayer}'s turn!`);
        }
    } 
    // If a piece is already selected, attempt to move it
    else if (selectedPiece) {
        movePiece(selectedPiece, square);
    }
}

function selectPiece(square) {
    selectedPiece = square;
    previousColor = square.style.backgroundColor;
    square.style.backgroundColor = "#aaf7aa"; // Highlight selected piece
}

function movePiece(fromSquare, toSquare) {
    const pieceType = fromSquare.getAttribute('data-piece');
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);

    if (isValidMove(pieceType, fromRow, fromCol, toRow, toCol, toSquare)) {
        // Move the piece
        toSquare.textContent = fromSquare.textContent;
        toSquare.setAttribute('data-piece', pieceType);
        fromSquare.textContent = "";
        fromSquare.removeAttribute('data-piece');

        // End turn
        currentPlayer = currentPlayer === "white" ? "black" : "white";
    } else {
        alert("Invalid move!");
    }
    deselectPiece();
}

function undoMove(fromSquare, toSquare, previousPiece) {
    fromSquare.textContent = toSquare.textContent;
    fromSquare.setAttribute('data-piece', toSquare.getAttribute('data-piece'));
    toSquare.textContent = previousPiece ? getPieceSymbol(previousPiece) : "";
    if (previousPiece) {
        toSquare.setAttribute('data-piece', previousPiece);
    } else {
        toSquare.removeAttribute('data-piece');
    }
}

function isKingInCheck(player) {
    const kingSquare = findKing(player);
    const opponentPieces = document.querySelectorAll(`[data-piece*="${opponent(player)}"]`);

    for (const piece of opponentPieces) {
        if (isValidMove(piece.getAttribute('data-piece'), parseInt(piece.dataset.row), parseInt(piece.dataset.col),
            parseInt(kingSquare.dataset.row), parseInt(kingSquare.dataset.col), kingSquare, false)) {
            return true;
        }
    }
    return false;
}

function isCheckmate(player) {
    const playerPieces = document.querySelectorAll(`[data-piece*="${player}"]`);

    for (const piece of playerPieces) {
        const fromRow = parseInt(piece.dataset.row);
        const fromCol = parseInt(piece.dataset.col);
        const pieceType = piece.getAttribute('data-piece');

        for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
                const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                if (isValidMove(pieceType, fromRow, fromCol, toRow, toCol, toSquare, false)) {
                    const tempPiece = toSquare.getAttribute('data-piece');
                    makeMove(piece, toSquare);

                    const stillInCheck = isKingInCheck(player);
                    undoMove(piece, toSquare, tempPiece);

                    if (!stillInCheck) return false; // Found a valid move
                }
            }
        }
    }
    return true; // No valid moves found
}

function findKing(player) {
    return [...document.querySelectorAll('.column')].find(square =>
        square.getAttribute('data-piece') === `king-${player}`
    );
}

function opponent() {
    return currentPlayer === "white" ? "black" : "white";
}

function deselectPiece() {
    if (selectedPiece) {
        selectedPiece.style.backgroundColor = previousColor; // Remove highlight
        selectedPiece = null;
    }
}

function isValidMove(pieceType, fromRow, fromCol, toRow, toCol, toSquare) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Prevent capturing own pieces
    if (toSquare.hasAttribute('data-piece') && 
        toSquare.getAttribute('data-piece').includes(pieceType.split('-')[1])) {
        return false;
    }

    // Obstacle detection: For Rook, Bishop, and Queen
    if (["rook", "bishop", "queen"].some(type => pieceType.includes(type))) {
        if (!isPathClear(fromRow, fromCol, toRow, toCol)) {
            return false;
        }
    }

    switch (pieceType) {
        case 'pawn-white':
            return isValidPawnMove(fromRow, toRow, colDiff, 1, toSquare);
        case 'pawn-black':
            return isValidPawnMove(fromRow, toRow, colDiff, -1, toSquare);
        case 'rook-white':
        case 'rook-black':
            return rowDiff === 0 || colDiff === 0;
        case 'knight-white':
        case 'knight-black':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        case 'bishop-white':
        case 'bishop-black':
            return rowDiff === colDiff;
        case 'queen-white':
        case 'queen-black':
            return rowDiff === colDiff || rowDiff === 0 || colDiff === 0;
        case 'king-white':
        case 'king-black':
            return rowDiff <= 1 && colDiff <= 1;
        default:
            return false;
    }
}

function isValidPawnMove(fromRow, toRow, colDiff, direction, toSquare) {
    // One square forward
    if (colDiff === 0 && !toSquare.hasAttribute('data-piece')) {
        return toRow - fromRow === direction;
    }
    // Two squares forward (first move)
    if (colDiff === 0 && !toSquare.hasAttribute('data-piece')) {
        if ((fromRow === 6 && direction === -1) || (fromRow === 1 && direction === 1)) {
            return toRow - fromRow === 2 * direction;
        }
    }
    // Capture diagonally
    if (colDiff === 1 && toSquare.hasAttribute('data-piece')) {
        return toRow - fromRow === direction;
    }
    return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        const square = document.querySelector(
            `[data-row="${currentRow}"][data-col="${currentCol}"]`
        );
        if (square.hasAttribute('data-piece')) {
            return false; // Obstacle found
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}
