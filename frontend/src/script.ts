import { Player, Particle, Bullet, Enemy } from "./classes/index";
import { setCanvasSize } from "./utils/canvasSize";
import spawnEnemies from "./gameLogic/spawnEnemies";
import gsap from "gsap";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d", {
  antialias: true,
}) as CanvasRenderingContext2D;
const scoreElement = document.getElementById("scoreElement") as HTMLSpanElement;
const gameModal = document.getElementById("gameModal") as HTMLDivElement;
const singlePlayerBtn = document.getElementById(
  "singlePlayer"
) as HTMLButtonElement;
const multiPlayerBtn = document.getElementById(
  "multiPlayer"
) as HTMLButtonElement;
const endScore = document.getElementById("endScore") as HTMLHeadingElement;
const darkModeToggle = document.getElementById(
  "darkModeToggle"
) as HTMLButtonElement;

addEventListener("resize", () => {
  setCanvasSize(canvas, ctx);
  location.reload();
});

// theme
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

darkModeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  // Save preference
  if (document.documentElement.classList.contains("dark")) {
    localStorage.theme = "dark";
    playersArray[0].color = "#ffffff"; // White color for player in dark mode
    if (multiplayer) playersArray[1].color = "#ffffff"; // White color for player in dark mode
  } else {
    localStorage.theme = "light";
    playersArray[0].color = "#000000"; // Black color for player in light mode
    if (multiplayer) playersArray[1].color = "#000000"; // Black color for player in light mode
  }
});

let bulletsArray: Bullet[] = [];
let enemiesArray: Enemy[] = [];
let particlesArray: Particle[] = [];
let playersArray: Player[] = [];
let spawnEnemyIntervalId: () => void;
let multiplayer = false;
let ws: WebSocket;
let playerId: number;
let roomId: number;

//all functions
function updateGameColors() {
  const isDark = document.documentElement.classList.contains("dark");
  playersArray[0].color = isDark ? "#ffffff" : "#000000";
  if (multiplayer) playersArray[1].color = isDark ? "#ffffff" : "#000000";
}
function init() {
  bulletsArray = [];
  enemiesArray = [];
  particlesArray = [];
  scoreElement.innerHTML = String(0);
  if (spawnEnemyIntervalId) spawnEnemyIntervalId();
}

function endGame() {
  cancelAnimationFrame(animationId);
  gameModal.style.display = "flex";
  endScore.innerHTML = score;
  score = String(0);
}

// invoking player class
function createPlayer() {
  if (multiplayer) {
    playersArray[0] = new Player(
      innerWidth / 2 + 50,
      innerHeight / 2,
      10,
      "white",
      ctx
    );

    playersArray[0].draw();

    playersArray[1] = new Player(
      innerWidth / 2 - 50,
      innerHeight / 2,
      10,
      "white",
      ctx
    );
    playersArray[1].draw();
  } else {
    playersArray[0] = new Player(
      innerWidth / 2,
      innerHeight / 2,
      10,
      "white",
      ctx
    );
    playersArray[0].draw();
  }
}

//animating
let animationId: number;
let score = String(0);
function animate(multiPlayer: boolean) {
  animationId = requestAnimationFrame(() => animate(multiPlayer));
  const isDark = document.documentElement.classList.contains("dark");
  ctx.fillStyle = isDark ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  playersArray[0].draw();
  if (multiPlayer) playersArray[1].draw();

  bulletsArray.forEach((eachBullet) => eachBullet.update());

  particlesArray.forEach((particle, index) => {
    if (particle.opacity <= 0) {
      particlesArray.splice(index, 1);
    } else {
      particle.update();
    }
  });

  for (let eIndex = enemiesArray.length - 1; eIndex >= 0; eIndex--) {
    const enemy = enemiesArray[eIndex];
    enemy.update();

    for (let bIndex = bulletsArray.length - 1; bIndex >= 0; bIndex--) {
      const bullet = bulletsArray[bIndex];
      const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

      // Remove bullets if they go off-screen
      if (
        bullet.x + bullet.radius < 0 ||
        bullet.x - bullet.radius > canvas.width ||
        bullet.y + bullet.radius < 0 ||
        bullet.y - bullet.radius > canvas.height
      ) {
        bulletsArray.splice(bIndex, 1);
        continue;
      }

      // Remove enemies and bullets on collision
      if (dist - enemy.radius - bullet.radius < 1) {
        score = String(Number(score) + 5);
        scoreElement.innerHTML = String(score);

        // Create particles/explosions on hit
        for (let i = 0; i < enemy.radius * (innerWidth < 800 ? 1 : 1.5); i++) {
          particlesArray.push(
            new Particle(
              bullet.x,
              bullet.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              },
              ctx
            )
          );
        }

        if (enemy.radius - 5 >= 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 5,
          });
          bulletsArray.splice(bIndex, 1);
        } else {
          enemiesArray.splice(eIndex, 1);
          bulletsArray.splice(bIndex, 1);
        }
      }
    }

    // End game if enemy hits player
    const distFromPlayer = Math.hypot(
      playersArray[0].x - enemy.x,
      playersArray[0].y - enemy.y
    );
    if (distFromPlayer - enemy.radius - playersArray[0].radius < 1) {
      endGame();
    }
  }
}

// making bullets on click
addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - innerHeight / 2,
    event.clientX - innerWidth / 2
  );

  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };

  if (multiplayer) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          event: "fireBullet",
          data: {
            playerId,
            roomId,
            x: innerWidth / 2 - 50,
            y: innerHeight / 2,
            radius: 5,
            velocity,
          },
        })
      );
    }

    bulletsArray.push(
      new Bullet(innerWidth / 2 + 50, innerHeight / 2, 5, velocity, ctx)
    );
  } else {
    bulletsArray.push(
      new Bullet(innerWidth / 2, innerHeight / 2, 5, velocity, ctx)
    );
  }
});

// start game
singlePlayerBtn.addEventListener("click", () => {
  multiplayer = false;
  createPlayer();
  updateGameColors();
  setCanvasSize(canvas, ctx);
  init();
  animate(false);
  const intervalId = spawnEnemies(canvas, enemiesArray, ctx);
  spawnEnemyIntervalId = intervalId;
  gameModal.style.display = "none";
});

multiPlayerBtn.addEventListener("click", () => {
  multiplayer = true;
  createPlayer();
  updateGameColors();
  setCanvasSize(canvas, ctx);
  init();
  animate(true);
  gameModal.style.display = "none";

  ws = new WebSocket("ws://localhost:8080/game");
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        event: "init",
        data: {
          name: "abv",
          canvasWidth: innerWidth,
          canvasHeight: innerHeight,
        },
      })
    );
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "start": {
        const data = message.data;

        playerId = data.player.id;
        roomId = data.player.roomId;
        break;
      }

      case "createEnemy": {
        const data = message.data.enemy;
        let velocity = {
          x: Math.cos(data.angle) * 2,
          y: Math.sin(data.angle) * 2,
        };
        enemiesArray.push(
          new Enemy(data.x, data.y, data.radius, data.color, velocity, ctx)
        );
        break;
      }

      case "fireBullet": {
        const data = message.data.bullet;
        bulletsArray.push(
          new Bullet(data.x, data.y, data.radius, data.velocity, ctx)
        );
        break;
      }
    }
  };
});
// handling screen resize
addEventListener("resize", () => {
  location.reload();
});
