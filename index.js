const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Circles
const circles = [
  { x: 50, y: 50, radius: 40, color: "red", clicked: false },
  { x: 50, y: 150, radius: 40, color: "green", clicked: false },
  { x: 50, y: 250, radius: 40, color: "blue", clicked: false },
  { x: 50, y: 350, radius: 40, color: "orange", clicked: false },
];

// One arrow per circle
const arrows = circles.map((circle, i) => ({
  x: 600,
  y: circle.y,
  length: 100,
  headSize: 20,
  speed: 4,
  moving: false,
  targetCircle: circle,
  targetX: 0,
  targetY: 0,
}));

function drawCircles() {
  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw border if clicked
    if (circle.clicked) {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  });
}

function drawArrows() {
  arrows.forEach((arrow) => {
    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + arrow.length, arrow.y);
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + arrow.headSize, arrow.y - arrow.headSize / 2);
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + arrow.headSize, arrow.y + arrow.headSize / 2);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircles();
  drawArrows();
}

function moveArrow(arrow) {
  if (!arrow.moving) return;

  const dx = arrow.targetX - arrow.x;
  const dy = arrow.targetY - arrow.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < arrow.speed) {
    arrow.x = arrow.targetX;
    arrow.y = arrow.targetY;
    arrow.moving = false;
    hitCircle(arrow.targetCircle);
    draw();
    return;
  }

  arrow.x += (dx / distance) * arrow.speed;
  arrow.y += (dy / distance) * arrow.speed;

  draw();
  requestAnimationFrame(() => moveArrow(arrow));
}

function hitCircle(circle) {
  circle.color = "gray";
  draw();
}

// Click listener
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  circles.forEach((circle, i) => {
    const dx = clickX - circle.x;
    const dy = clickY - circle.y;

    if (Math.sqrt(dx * dx + dy * dy) <= circle.radius) {
      circles.forEach((c) => (c.clicked = false));
      circle.clicked = true;

      // Set target to touch the edge
      const arrow = arrows[i];
      const diffX = circle.x - arrow.x;
      const diffY = circle.y - arrow.y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);

      arrow.targetX = circle.x - (diffX / distance) * circle.radius;
      arrow.targetY = circle.y - (diffY / distance) * circle.radius;
      arrow.moving = true;
      moveArrow(arrow);
    }
  });
});

// Initial draw
draw();
