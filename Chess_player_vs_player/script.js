let selectedPiece = null;

document.querySelectorAll('.column').forEach(square => {
    square.addEventListener('click', handleSquareClick);
});

function handleSquareClick(event) {
    const square = event.target;
    
    // If no piece is selected and clicked square has a piece
    if (!selectedPiece && square.hasAttribute('data-piece')) {
        selectedPiece = square;
        square.style.backgroundColor = '#aaf7aa'; // Highlight selected piece
        return;
    }

    // If a piece is selected
    if (selectedPiece) {
        // If clicking the same square, deselect
        if (selectedPiece === square) {
            deselectPiece();
            return;
        }

        // Move the piece
        if (selectedPiece.hasAttribute('data-piece')) {
            const piece = selectedPiece.textContent;
            const pieceType = selectedPiece.getAttribute('data-piece');
            
            // Move the piece to the new square
            square.textContent = piece;
            square.setAttribute('data-piece', pieceType);
            
            // Clear the old square
            selectedPiece.textContent = '';
            selectedPiece.removeAttribute('data-piece');
        }

        deselectPiece();
    }
}

function deselectPiece() {
    if (selectedPiece) {
        selectedPiece.style.backgroundColor = ''; // Remove highlight
        selectedPiece = null;
    }
}
