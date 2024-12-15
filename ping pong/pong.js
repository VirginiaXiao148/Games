const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

// Crear el paddle
const paddleWidth = 10, paddleHeight = 100;
const player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "WHITE" };
const computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "WHITE" };

// Crear la pelota
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speed: 5, velocityX: 5, velocityY: 5, color: "WHITE" };

// Dibujar rectángulo
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Dibujar círculo
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Dibujar la red
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
    }
}

// Dibujar el texto
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
}

// Renderizar el juego
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000"); // Fondo
    drawNet();
    drawText("Jugador", canvas.width / 4, canvas.height / 5, "WHITE");
    drawText("Computadora", 3 * canvas.width / 4, canvas.height / 5, "WHITE");
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Actualizar la posición de la pelota
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Detectar colisión con las paredes
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Detectar colisión con los paddles
    let playerPaddle = (ball.x < canvas.width / 2) ? player : computer;
    if (collision(ball, playerPaddle)) {
        ball.velocityX = -ball.velocityX;
    }
}

// Detectar colisión
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Juego principal
function game() {
    update();
    render();
}

// Bucle del juego
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
