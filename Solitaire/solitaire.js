// Card class to represent each playing card
class Card {
    constructor(suit, value, faceUp = false) {
        this.suit = suit;
        this.value = value;
        this.faceUp = faceUp;
        this.element = this.createCardElement();
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.suit = this.suit;
        card.dataset.value = this.value;
        this.updateCardDisplay(card);
        return card;
    }

    updateCardDisplay(element) {
        if (this.faceUp) {
            const color = (this.suit === '♥' || this.suit === '♦') ? 'red' : 'black';
            element.style.color = color;
            element.textContent = `${this.value}${this.suit}`;
            element.style.backgroundColor = 'white';
        } else {
            element.textContent = '';
            element.style.backgroundColor = '#044d1c';
        }
    }

    flip() {
        this.faceUp = !this.faceUp;
        this.updateCardDisplay(this.element);
    }
}

// Game class to manage the game state
class SolitaireGame {
    constructor() {
        this.deck = [];
        this.wastePile = [];
        this.foundations = {
            '♥': [],
            '♦': [],
            '♣': [],
            '♠': []
        };
        this.tableau = Array(7).fill().map(() => []);
        this.initializeDeck();
        this.dealCards();
        this.setupEventListeners();
    }

    initializeDeck() {
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (const suit of suits) {
            for (const value of values) {
                this.deck.push(new Card(suit, value));
            }
        }
        
        // Shuffle the deck
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        // Deal cards to tableau
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                const card = this.deck.pop();
                if (i === j) {
                    card.flip(); // Flip the top card
                }
                this.tableau[j].push(card);
                document.querySelector(`[data-column="${j}"]`).appendChild(card.element);
            }
        }

        // Place remaining cards in deck
        const deckElement = document.querySelector('.deck');
        this.deck.forEach(card => {
            deckElement.appendChild(card.element);
        });
    }

    setupEventListeners() {
        // Add click handler for deck
        document.querySelector('.deck').addEventListener('click', () => this.drawCard());

        // Add click handlers for tableau columns
        document.querySelectorAll('.tableau').forEach(column => {
            column.addEventListener('click', (e) => this.handleTableauClick(e));
        });

        // Add click handlers for foundation piles
        document.querySelectorAll('.foundation').forEach(foundation => {
            foundation.addEventListener('click', (e) => this.handleFoundationClick(e));
        });
    }

    drawCard() {
        if (this.deck.length === 0) {
            // Reset deck from waste pile
            while (this.wastePile.length > 0) {
                const card = this.wastePile.pop();
                card.flip();
                this.deck.unshift(card);
            }
        } else {
            const card = this.deck.pop();
            card.flip();
            this.wastePile.push(card);
            document.querySelector('.waste-pile').appendChild(card.element);
        }
    }

    // Placeholder for tableau click handler
    handleTableauClick(event) {
        // Implementation for moving cards between tableau columns
        // Will be implemented in next phase
    }

    // Placeholder for foundation click handler
    handleFoundationClick(event) {
        // Implementation for moving cards to foundation piles
        // Will be implemented in next phase
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new SolitaireGame();
});