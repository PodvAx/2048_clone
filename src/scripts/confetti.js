let canvas;
let ctx;
let confettiParticles = [];
let animationFrameId;
let intervalId;

export function startConfetti() {
  if (canvas) return;

  canvas = document.createElement("canvas");
  canvas.classList.add("confetti-container");
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  createConfettiExplosion();
  animationFrameId = requestAnimationFrame(updateConfetti);
}

export function stopConfetti() {
  cancelAnimationFrame(animationFrameId);
  confettiParticles = [];
  clearInterval(intervalId);
  intervalId = null;

  if (canvas) {
    canvas.remove();
    canvas = null;
  }
  window.removeEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createConfettiExplosion() {
  for (let i = 0; i < 100; i++) {
    confettiParticles.push(new ConfettiParticle(true));
  }

  setTimeout(() => {
    if (!intervalId) {
      intervalId = setInterval(() => {
        confettiParticles.push(new ConfettiParticle(false));
      }, 150);
    }
  }, 1000);
}

class ConfettiParticle {
  constructor(isExplosion) {
    this.x = isExplosion
      ? window.innerWidth / 2 + (Math.random() - 0.5) * 200
      : Math.random() * window.innerWidth; // випадкова горизонтальна відстань
    this.y = -10; // вибух з середини
    this.size = Math.random() * 4 + 8;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.angle = (Math.random() - 0.5) * Math.PI; // Випадковий кут (-90° до 90°)

    // Випадкові швидкості
    this.velocityX = (Math.random() - 0.5) * (isExplosion ? 10 : 2);

    this.velocityY = isExplosion
      ? Math.random() * 7 + 1 // більш випадковий вертикальний рух при вибуху
      : Math.random() * 3 + 1;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;
    this.opacity = 1;

    // Випадкова форма, яку частинка отримає один раз
    const shapeChoice = Math.random();

    if (shapeChoice > 0.66) {
      this.shape = "square";
    } else if (shapeChoice > 0.33) {
      this.shape = "circle";
    } else {
      this.shape = "triangle";
    }
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.angle += this.rotationSpeed;
    this.opacity -= 0.003;

    if (this.isOutOfBounds() || this.opacity <= 0) {
      return false;
    }

    return true;
  }

  isOutOfBounds() {
    return (
      this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight
    );
  }

  draw(ctx1) {
    ctx1.save();
    ctx1.translate(this.x, this.y);
    ctx1.rotate(this.angle);
    ctx1.fillStyle = this.color;
    ctx1.globalAlpha = this.opacity;

    if (this.shape === "square") {
      ctx1.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); // квадрат
    } else if (this.shape === "circle") {
      ctx1.beginPath();
      ctx1.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
      ctx1.fill();
    } else if (this.shape === "triangle") {
      ctx1.beginPath();
      ctx1.moveTo(0, -this.size / 2);
      ctx1.lineTo(-this.size / 2, this.size / 2);
      ctx1.lineTo(this.size / 2, this.size / 2);
      ctx1.closePath();
      ctx1.fill();
    }

    ctx1.restore();
  }
}

function updateConfetti() {
  if (!canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо canvas
  confettiParticles = confettiParticles.filter((particle) => particle.update());
  confettiParticles.forEach((particle) => particle.draw(ctx)); // Малюємо частинки

  animationFrameId = requestAnimationFrame(updateConfetti); // Оновлюємо анімацію
}
