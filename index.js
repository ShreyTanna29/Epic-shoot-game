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
    this.x += this.velocity.x;
    this.y += this.velocity.y;
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
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// invoking player class
const player = new Player(canvas.width / 2, canvas.height / 2, 10, "white");
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

    // creating enemies
    let color = `hsl(${Math.random() * 360},50%,50%)`;
    let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    let velocity = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2,
    };

    enemiesArray.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

spawnEnemies();
//animating
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  bulletsArray.forEach((eachBullet) => eachBullet.update());

  enemiesArray.forEach((enemy, eIndex) => {
    enemy.update();

    bulletsArray.forEach((bullet, bIndex) => {
      let dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

      //removing bullets when they go off screen
      if (
        bullet.x + bullet.radius < 0 ||
        bullet.x - bullet.radius > canvas.width ||
        bullet.y + bullet.radius < 0 ||
        bullet.y - bullet.radius > canvas.height
      ) {
        setTimeout(() => {
          bulletsArray.splice(bIndex, 1);
        }, 0);
      }

      //removing enemy when bullet hits it
      if (dist - enemy.radius - bullet.radius < 1) {
        if (enemy.radius - 10 > 10) {
          setTimeout(() => {
            enemy.radius -= 10;
            bulletsArray.splice(bIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemiesArray.splice(eIndex, 1);
            bulletsArray.splice(bIndex, 1);
          }, 0);
        }
      }
    });

    // if enemy hits a player game ends
    const distFromPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distFromPlayer - enemy.radius - player.radius < 1) {
      setTimeout(() => {
        cancelAnimationFrame(animationId);
      }, 0);
    }
  });
}

// making bullets on click
addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };

  bulletsArray.push(
    new Bullet(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

animate();
