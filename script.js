const { fromEvent } = rxjs

const GAME_SPEED = 250
const CANVAS_BACKGROUND_COLOUR = 'black'
const SNAKE_COLOUR = 'lightgreen'
const FOOD_COLOUR = 'red'
const LEFT_KEY = 37
const RIGHT_KEY = 39
const UP_KEY = 38
const DOWN_KEY = 40

const snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 }
]

let score = 0
let changingDirection = false
let foodX
let foodY
let dx = 10
let dy = 0

const scoreboard = document.getElementById('score')
const gameCanvas = document.getElementById('gameCanvas')
const ctx = gameCanvas.getContext('2d')

main()
createFood()

fromEvent(document, 'keydown').subscribe(event => changeDirection(event))

function main() {
  if (isGameEnd()) {
    scoreboard.innerHTML =
      'GAME OVER   </br> <span style="color:lightgreen; font-size: 50px">and happy New Year</span>'
    return
  }
  setTimeout(function() {
    changingDirection = false
    clearCanvas()
    drawFood()
    advanceSnake()
    drawSnake()
    main()
  }, GAME_SPEED)
}

function clearCanvas() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOUR
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
}

function drawFood() {
  ctx.fillStyle = FOOD_COLOUR
  ctx.fillRect(foodX, foodY, 10, 10)
  ctx.strokeRect(foodX, foodY, 10, 10)
}

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }
  snake.unshift(head)
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY
  if (didEatFood) {
    score += 1
    scoreboard.innerHTML = score
    createFood()
  } else {
    snake.pop()
  }
}

function isGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10)
  foodY = randomTen(0, gameCanvas.height - 10)
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsoNsnake = part.x == foodX && part.y == foodY
    if (foodIsoNsnake) createFood()
  })
}

function drawSnake() {
  snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOUR

  if (snake[0].x < 0) snake[0].x = gameCanvas.width - 10
  if (snake[0].x > gameCanvas.width - 10) snake[0].x = 0
  if (snake[0].y < 0) snake[0].y = gameCanvas.height - 10
  if (snake[0].y > gameCanvas.height - 10) snake[0].y = 0

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
}

function changeDirection(event) {
  if (changingDirection) return
  changingDirection = true
  const keyPressed = event.keyCode
  const goingUp = dy === -10
  const goingDown = dy === 10
  const goingRight = dx === 10
  const goingLeft = dx === -10
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10
    dy = 0
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0
    dy = -10
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10
    dy = 0
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0
    dy = 10
  }
}
