const canvas = document.querySelector("#canvas");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
let canvasBoundaries = [2, 2, width - 2, height - 2];

const context = canvas.getContext("2d");
context.fillStyle = "white";
context.strokeStyle = "white";
const snakeSectionDiameter = 40;
let defaultVelocity = 100;
let velocity = { x: snakeSectionDiameter / 2, y: 0 };
let collided = false;
let selfCollide = false;
let previousXs = [];
let previousYs = [];
let gameStart = true;
let fruit = createFruit();
let snake = [
  {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
  },
];
let canvasWidth = width;
let canvasHeight = height;

function animate() {
  setTimeout(() => {
    const frame = requestAnimationFrame(animate);
  }, defaultVelocity);

  // clear screen
  context.clearRect(0, 0, width, height);

  context.rect(
    canvasBoundaries[0],
    canvasBoundaries[1],
    canvasBoundaries[2],
    canvasBoundaries[3]
  );
  context.stroke();

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
  // Add new snake bit to the front of the array
  snake.unshift({ x: snake[0].x + velocity.x, y: snake[0].y + velocity.y });
  // Remove last snake bit from end of the array
  snake.pop();

  collisionDetection();

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
            if (velocity.y || snake.length === 1)
              velocity.x = snakeSectionDiameter;
            velocity.y = 0;
          }
          if (e.key === "ArrowLeft") {
            if (velocity.y || snake.length === 1)
              velocity.x = -snakeSectionDiameter;
            velocity.y = 0;
          }
          if (e.key === "ArrowDown") {
            if (velocity.x || snake.length === 1)
              velocity.y = snakeSectionDiameter;
            velocity.x = 0;
          }
          if (e.key === "ArrowUp") {
            if (velocity.x || snake.length === 1)
              velocity.y = -snakeSectionDiameter;
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
  fruit = createFruit();
  snake.push(snake[snake.length - 1]);
  if (defaultVelocity > 25) defaultVelocity -= 0.5;

  // if (
  //   canvasBoundaries[0] < width / 4 &&
  //   canvasBoundaries[1] < height / 4 &&
  //   canvasBoundaries[2] > width - width / 4 &&
  //   canvasBoundaries[3] > height - height / 4
  // ) {
  //   canvasBoundaries = [
  //     canvasBoundaries[0] + snakeSectionDiameter / 4,
  //     canvasBoundaries[1] + snakeSectionDiameter / 4,
  //     canvasBoundaries[2] - snakeSectionDiameter / 2,
  //     canvasBoundaries[3] - snakeSectionDiameter / 2,
  //   ];
  // }
}

function handleDrawFruit() {
  context.beginPath();
  context.rect(fruit.x, fruit.y, snakeSectionDiameter, snakeSectionDiameter);
  context.fill();
}

function randomIntFromInterval(min, max) {
  const doubleMin = min * 2;
  return (
    Math.floor(
      Math.floor(Math.random() * (max - doubleMin + 1) + doubleMin) / snakeSectionDiameter
    ) * snakeSectionDiameter
  );
}

function collisionDetection() {
  const x = snake[0].x;
  const y = snake[0].y;
  // Create temporary snake to check against
  const tempSnake = [...snake];
  // Remove index 0
  tempSnake.shift();
  // Check the Xs and Ys for each snake section against head
  tempSnake.forEach((item) =>
    item.x == snake[0].x && item.y == snake[0].y ? (selfCollide = true) : false
  );
  if (
    x <= fruit.x + snakeSectionDiameter &&
    x >= fruit.x - snakeSectionDiameter &&
    y >= fruit.y - snakeSectionDiameter &&
    y <= fruit.y + snakeSectionDiameter
  ) {
    collided = true;
    selfCollide = false;
  } else {
    collided = false;
  }
}

function handleEndGame() {
  context.clearRect(0, 0, width, height);
  context.font = "30px Arial";
  context.fillText("You lose!", width / 2 - 50, height / 2 - 25);
  cancelAnimationFrame();
}

function createFruit(){
  return {
    x: randomIntFromInterval(
      snakeSectionDiameter,
      canvasBoundaries[2] - snakeSectionDiameter
    ),
    y: randomIntFromInterval(
      snakeSectionDiameter,
      canvasBoundaries[3] - snakeSectionDiameter
    ),
  }
}
