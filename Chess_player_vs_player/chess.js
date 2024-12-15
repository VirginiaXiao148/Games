let selectedPiece = null;
let previousColor = "";

document.querySelectorAll('.column').forEach((square, index) => {
    // Assign square position (row, col) based on index
    square.dataset.row = Math.floor(index / 8);
    square.dataset.col = index % 8;
    square.addEventListener('click', handleSquareClick);
});

function handleSquareClick(event) {
    const square = event.target;

    if (!selectedPiece && square.hasAttribute('data-piece')) {
        selectPiece(square);
    } else if (selectedPiece) {
        movePiece(selectedPiece, square);
    }
}

function selectPiece(square) {
    selectedPiece = square;
    previousColor = square.style.backgroundColor;
    square.style.backgroundColor = "#aaf7aa";
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
    } else {
        alert("Invalid move!");
    }
    deselectPiece();
}

function deselectPiece() {
    if (selectedPiece) {
        selectedPiece.style.backgroundColor = previousColor;
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
    // Normal move: one square forward
    if (colDiff === 0 && !toSquare.hasAttribute('data-piece')) {
        return toRow - fromRow === direction;
    }
    // Capture move: one square diagonally forward
    if (colDiff === 1 && toSquare.hasAttribute('data-piece')) {
        return toRow - fromRow === direction;
    }
    return false;
}
