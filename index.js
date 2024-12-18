const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const bulletsArray = [];
const enemiesArray = [];

//classes
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Bullet {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x * 10;
    this.y += this.velocity.y * 10;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x * 5;
    this.y += this.velocity.y * 5;
  }
}

// invoking player class
const player = new Player(canvas.width / 2, canvas.height / 2, 20, "red");
player.draw();

//generating enemies
function spawnEnemies() {
  setInterval(() => {
    let radius = Math.random() * (50 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    let color = "green";
    let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    let velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemiesArray.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

spawnEnemies();
//animating
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  bulletsArray.forEach((eachBullet) => eachBullet.update());
  enemiesArray.forEach((enemy, eIndex) => {
    enemy.update();

    bulletsArray.forEach((bullet, bIndex) => {
      let dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

      if (dist - enemy.radius - bullet.radius < 1) {
        setTimeout(() => {
          enemiesArray.splice(eIndex, 1);
          bulletsArray.splice(bIndex, 1);
        }, 0);
      }
    });
  });
}

// making bullets on click
addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  bulletsArray.push(
    new Bullet(canvas.width / 2, canvas.height / 2, 5, "pink", velocity)
  );
});

animate();
