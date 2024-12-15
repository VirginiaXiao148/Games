import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
PADDLE_WIDTH = 15
PADDLE_HEIGHT = 90
BALL_SIZE = 15
PADDLE_SPEED = 5
BALL_SPEED = 7

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Set up the game window
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("Ping Pong")
clock = pygame.time.Clock()

# Create game objects
player = pygame.Rect(50, WINDOW_HEIGHT//2 - PADDLE_HEIGHT//2, PADDLE_WIDTH, PADDLE_HEIGHT)
opponent = pygame.Rect(WINDOW_WIDTH - 50 - PADDLE_WIDTH, WINDOW_HEIGHT//2 - PADDLE_HEIGHT//2, PADDLE_WIDTH, PADDLE_HEIGHT)
ball = pygame.Rect(WINDOW_WIDTH//2 - BALL_SIZE//2, WINDOW_HEIGHT//2 - BALL_SIZE//2, BALL_SIZE, BALL_SIZE)

# Ball speed
ball_speed_x = BALL_SPEED
ball_speed_y = BALL_SPEED

# Score
player_score = 0
opponent_score = 0
font = pygame.font.Font(None, 74)

def reset_ball():
    ball.center = (WINDOW_WIDTH//2, WINDOW_HEIGHT//2)
    global ball_speed_x, ball_speed_y
    ball_speed_y = BALL_SPEED
    ball_speed_x = BALL_SPEED

# Game loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
    
    # Player movement
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP] and player.top > 0:
        player.y -= PADDLE_SPEED
    if keys[pygame.K_DOWN] and player.bottom < WINDOW_HEIGHT:
        player.y += PADDLE_SPEED
    
    # Simple AI for opponent
    if opponent.centery < ball.centery and opponent.bottom < WINDOW_HEIGHT:
        opponent.y += PADDLE_SPEED
    if opponent.centery > ball.centery and opponent.top > 0:
        opponent.y -= PADDLE_SPEED
    
    # Ball movement
    ball.x += ball_speed_x
    ball.y += ball_speed_y
    
    # Ball collisions
    if ball.top <= 0 or ball.bottom >= WINDOW_HEIGHT:
        ball_speed_y *= -1
    
    if ball.colliderect(player) or ball.colliderect(opponent):
        ball_speed_x *= -1
    
    # Score points
    if ball.left <= 0:
        opponent_score += 1
        reset_ball()
    if ball.right >= WINDOW_WIDTH:
        player_score += 1
        reset_ball()
    
    # Drawing
    screen.fill(BLACK)
    pygame.draw.rect(screen, WHITE, player)
    pygame.draw.rect(screen, WHITE, opponent)
    pygame.draw.ellipse(screen, WHITE, ball)
    pygame.draw.aaline(screen, WHITE, (WINDOW_WIDTH//2, 0), (WINDOW_WIDTH//2, WINDOW_HEIGHT))
    
    # Display score
    player_text = font.render(str(player_score), True, WHITE)
    opponent_text = font.render(str(opponent_score), True, WHITE)
    screen.blit(player_text, (WINDOW_WIDTH//4, 20))
    screen.blit(opponent_text, (3*WINDOW_WIDTH//4, 20))
    
    pygame.display.flip()
    clock.tick(60)
