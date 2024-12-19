const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreElement");
const gameModal = document.getElementById("gameModal");
const startBtn = document.getElementById("startBtn");
const endScore = document.getElementById("endScore");

canvas.width = innerWidth;
canvas.height = innerHeight;

let bulletsArray = [];
let enemiesArray = [];
let particlesArray = [];
let spawnEnemyIntervalId;

//all functions
function init() {
  bulletsArray = [];
  enemiesArray = [];
  particlesArray = [];
  scoreElement.innerHTML = 0;
  clearInterval(spawnEnemyIntervalId);
}

function endGame() {
  cancelAnimationFrame(animationId);
  gameModal.style.display = "flex";
  endScore.innerHTML = score;
  score = 0;
}

//all classes
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

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.opacity = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    //adding friction so particels. so particles are slowed down.
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.opacity -= 0.01;
  }
}

// invoking player class
const player = new Player(canvas.width / 2, canvas.height / 2, 10, "white");
player.draw();

//generating enemies
function spawnEnemies() {
  spawnEnemyIntervalId = setInterval(() => {
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

//animating
let animationId;
let score = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  bulletsArray.forEach((eachBullet) => eachBullet.update());
  particlesArray.forEach((particle, index) => {
    if (particle.opacity <= 0) {
      particlesArray.splice(index, 1);
    } else {
      particle.update();
    }
  });

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
        bulletsArray.splice(bIndex, 1);
      }

      //removing enemy when bullet hits it
      if (dist - enemy.radius - bullet.radius < 1) {
        score += 5;
        scoreElement.innerHTML = score;
        //creating particles/explosions on hit
        for (let i = 0; i < enemy.radius * 1.5; i++) {
          particlesArray.push(
            new Particle(bullet.x, bullet.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 8),
              y: (Math.random() - 0.5) * (Math.random() * 8),
            })
          );
        }

        // shirinking and removing enemy on hit
        if (enemy.radius - 15 > 10) {
          setTimeout(() => {
            gsap.to(enemy, {
              radius: enemy.radius - 15,
            });
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

    //end game
    const distFromPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distFromPlayer - enemy.radius - player.radius < 1) {
      setTimeout(() => {
        endGame();
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

// start game
startBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  gameModal.style.display = "none";
});