let selectedPiece = null; // Currently selected piece (square)
let previousColor = "";   // Store background color to restore later

document.querySelectorAll('.column').forEach(square => {
    square.addEventListener('click', handleSquareClick);
});

function handleSquareClick(event) {
    const square = event.target;

    // If selecting a piece for the first time
    if (!selectedPiece && square.hasAttribute('data-piece')) {
        selectPiece(square);
        return;
    }

    // If clicking the same square, deselect the piece
    if (selectedPiece === square) {
        deselectPiece();
        return;
    }

    // Move the piece to a new square
    if (selectedPiece) {
        movePiece(selectedPiece, square);
        deselectPiece();
    }
}

// Select and highlight the piece
function selectPiece(square) {
    selectedPiece = square;
    previousColor = square.style.backgroundColor; // Save original background color
    square.style.backgroundColor = "#aaf7aa";     // Highlight the selected square
}

// Move the piece to the target square
function movePiece(fromSquare, toSquare) {
    // If the target square has no piece
    if (!toSquare.hasAttribute('data-piece')) {
        const piece = fromSquare.textContent;
        const pieceType = fromSquare.getAttribute('data-piece');

        // Update the target square
        toSquare.textContent = piece;
        toSquare.setAttribute('data-piece', pieceType);

        // Clear the original square
        fromSquare.textContent = "";
        fromSquare.removeAttribute('data-piece');
    } else {
        alert("You cannot move to a square that already has a piece!");
    }
}

// Deselect the current piece
function deselectPiece() {
    if (selectedPiece) {
        selectedPiece.style.backgroundColor = previousColor; // Restore the background
        selectedPiece = null; // Clear selection
    }
}
