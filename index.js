const canvas = document.querySelector("#canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
let canvasBoundaries = [0, 0, width, height];

const context = canvas.getContext("2d");
context.fillStyle = "white";
context.strokeStyle = "white";
const snakeSectionDiameter = 50;
let defaultVelocity = 100;
let velocity = { x: snakeSectionDiameter, y: 0 };
let collided = false;
let selfCollide = false;
let gameStart = true;
let fruit = setFruitLocation();
let snake = [
  {
    x: snakeSectionDiameter * 5.5,
    y: snakeSectionDiameter * 5.5,
  },
  {},
];
let canvasWidth = width;
let canvasHeight = height;

function animate() {
  setTimeout(() => {
    if (gameStart) requestAnimationFrame(animate);
  }, defaultVelocity);
  // clear screen
  context.clearRect(0, 0, width, height);

  if (collided) handleCollision();
  if (selfCollide) handleEndGame();
  // recalculate and redraw
  handleMovement();
  handleDrawFruit();
  // setup controls and barriers
  handleEdgeBounces();
  handleKeyPresses();
}

animate();

function handleMovement() {
  // Remove last snake bit from end of the array
  snake.pop();
  // Add new snake bit to the front of the array
  snake.unshift({ x: snake[0].x + velocity.x, y: snake[0].y + velocity.y });
  collisionDetection();

  // Draw snek
  for (let i = 0; i < snake.length; i++) {
    context.beginPath();
    context.arc(
      snake[i].x,
      snake[i].y,
      snakeSectionDiameter / 2,
      0,
      3 * Math.PI
    );
    context.stroke();
  }
}

function handleKeyPresses() {
  if (
    document.addEventListener(
      "keyup",
      (e) => {
        if (e.key === " ") {
          velocity.y = 0;
          velocity.x = 0;
        }
        if (!gameStart) {
          // If not in the game, left/right doesn't cancel up/down and vice versa
          if (e.key === "ArrowRight") {
            velocity.x = snakeSectionDiameter;
          }
          if (e.key === "ArrowLeft") {
            velocity.x = -snakeSectionDiameter;
          }
          if (e.key === "ArrowDown") {
            velocity.y = snakeSectionDiameter;
          }
          if (e.key === "ArrowUp") {
            velocity.y = -snakeSectionDiameter;
          }
        } else {
          if (e.key === "ArrowRight") {
            if (velocity.y) velocity.x = snakeSectionDiameter;
            velocity.y = 0;
          }
          if (e.key === "ArrowLeft") {
            if (velocity.y) velocity.x = -snakeSectionDiameter;
            velocity.y = 0;
          }
          if (e.key === "ArrowDown") {
            if (velocity.x) velocity.y = snakeSectionDiameter;
            velocity.x = 0;
          }
          if (e.key === "ArrowUp") {
            if (velocity.x) velocity.y = -snakeSectionDiameter;
            velocity.x = 0;
          }
        }
      },
      { once: true }
    )
  );
}

function handleEdgeBounces() {
  if (
    snake[0].x - snakeSectionDiameter / 2 >= canvasBoundaries[2] ||
    snake[0].x + snakeSectionDiameter / 2 <= canvasBoundaries[0]
  ) {
    if (gameStart) handleEndGame();
    velocity.x *= -1;
  }
  if (
    snake[0].y - snakeSectionDiameter / 2 >= canvasBoundaries[3] ||
    snake[0].y + snakeSectionDiameter / 2 <= canvasBoundaries[1]
  ) {
    if (gameStart) handleEndGame();
    velocity.y *= -1;
  }
}

function handleCollision() {
  // Move fruit
  fruit = setFruitLocation();
  // Add section onto end of snake array
  snake.push(snake[snake.length - 1]);
  // Reduce time between Timeouts (increase snek velocity)
  if (defaultVelocity > 25) defaultVelocity -= 0.5;
}

function handleDrawFruit() {
  context.beginPath();
  context.rect(
    fruit.x,
    fruit.y,
    snakeSectionDiameter - 3,
    snakeSectionDiameter - 3
  );
  context.fill();
}

function randomIntFromInterval(min, max) {
  const doubleMin = min * 2;
  return (
    Math.floor(
      Math.floor(Math.random() * (max - doubleMin + 1) + doubleMin) /
        snakeSectionDiameter
    ) * snakeSectionDiameter
  );
}

function collisionDetection() {
  // Check the Xs and Ys for each snake section against head
  snake.forEach((item, i) => {
    if (i === 0) return;
    item.x == snake[0].x && item.y == snake[0].y ? (selfCollide = true) : false;
  });

  const distanceBetweenSnakeHeadAndFruit = getDistance(
    snake[0].x,
    snake[0].y,
    fruit.x + snakeSectionDiameter / 2,
    fruit.y + snakeSectionDiameter / 2
  );
  if (Math.floor(distanceBetweenSnakeHeadAndFruit) < snakeSectionDiameter - 5) {
    collided = true;
  } else {
    collided = false;
  }
}

function handleEndGame() {
  context.clearRect(0, 0, width, height);
  context.font = "30px Arial";
  context.fillText("You lose!", width / 2 - 50, height / 2 - 25);
  gameStart = false;
}

function setFruitLocation() {
  return {
    x: randomIntFromInterval(
      snakeSectionDiameter,
      canvasBoundaries[2] - snakeSectionDiameter
    ),
    y: randomIntFromInterval(
      snakeSectionDiameter,
      canvasBoundaries[3] - snakeSectionDiameter
    ),
  };
}

function getDistance(x1, y1, x2, y2) {
  let y = x2 - x1;
  let x = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

function drawLine() {
  context.moveTo(
    fruit.x + snakeSectionDiameter / 2,
    fruit.y + snakeSectionDiameter / 2
  );
  context.lineTo(snake[0].x, snake[0].y);
  context.fillStyle = "red";
  context.stroke();
}
