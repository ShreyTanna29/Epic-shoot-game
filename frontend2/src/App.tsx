import { Player, Particle, Bullet, Enemy } from "./classes/index";
import { setCanvasSize } from "./utils/canvasSize";
import spawnEnemies from "./gameLogic/spawnEnemies";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function App() {
  const [bulletsArray, setBulletsArray] = useState<Bullet[]>([])
  const [enemiesArray, setEnemiesArray] = useState<Enemy[]>([])
  const [particlesArray, setParticlesArray] = useState<Particle[]>([])
  const [playersArray, setPlayersArray] = useState<Player[]>([])

  const canvas = useRef<HTMLCanvasElement>(null)

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvas.current) {
      const context = canvas.current?.getContext('2d', { antialias: true }) as CanvasRenderingContext2D
      if (context) setCtx(context);
    }
  }, [canvas]);

  useEffect(() => {

    const bulletEventListener = (event) => {
      if (!ctx) return

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
          if (playerNumber === 1) {
            ws.send(
              JSON.stringify({
                event: "fireBullet",
                data: {
                  playerId,
                  roomId,
                  x: innerWidth / 2 + 50,
                  y: innerHeight / 2,
                  radius: 5,
                  velocity,
                },
              })
            );
          } else {
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
        }

        if (playerNumber === 1) {
          bulletsArray.push(
            new Bullet(innerWidth / 2 + 50, innerHeight / 2, 5, velocity, ctx!)
          );
        } else {
          bulletsArray.push(
            new Bullet(innerWidth / 2 - 50, innerHeight / 2, 5, velocity, ctx!)
          );
        }
      } else {
        bulletsArray.push(
          new Bullet(innerWidth / 2, innerHeight / 2, 5, velocity, ctx!)
        );
      }
    }

    window.addEventListener("click", (event) => bulletEventListener(event))

    return window.removeEventListener("click", bulletEventListener)

  },)

  const scoreElement = useRef<HTMLSpanElement>(null)
  const gameModal = useRef<HTMLDivElement>(null)
  const endScore = useRef<HTMLHeadingElement>(null)
  const wonElement = useRef<HTMLParagraphElement>(null)
  const lostElement = useRef<HTMLParagraphElement>(null)

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const darkModeToggle = () => {
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
  }

  let spawnEnemyIntervalId: () => void;
  let multiplayer = false;
  let ws: WebSocket | null;
  let playerId: number;
  let roomId: number;
  let playerNumber: number;
  function updateGameColors() {
    const isDark = document.documentElement.classList.contains("dark");
    playersArray[0].color = isDark ? "#ffffff" : "#000000";
    if (multiplayer) playersArray[1].color = isDark ? "#ffffff" : "#000000";
  }
  function init() {
    setBulletsArray([]);
    setEnemiesArray([]);
    setParticlesArray([]);
    if (scoreElement.current) scoreElement.current.innerHTML = String(0);
    if (wonElement.current) wonElement.current.style.display = "none";
    if (lostElement.current) lostElement.current.style.display = "none";
    if (spawnEnemyIntervalId) spawnEnemyIntervalId();
  }
  function endGame() {
    cancelAnimationFrame(animationId);
    if (gameModal.current) gameModal.current.style.display = "flex";
    if (endScore.current) endScore.current.innerHTML = score;
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
        ctx!
      );

      playersArray[0].draw();

      playersArray[1] = new Player(
        innerWidth / 2 - 50,
        innerHeight / 2,
        10,
        "white",
        ctx!
      );
      playersArray[1].draw();
    } else {
      playersArray[0] = new Player(
        innerWidth / 2,
        innerHeight / 2,
        10,
        "white",
        ctx!
      );
      playersArray[0].draw();
    }
  }

  //animating
  let animationId: number;
  let score = String(0);



  addEventListener("resize", () => {
    setCanvasSize(canvas.current!, ctx!);
    location.reload();
  });
  function animate(multiPlayer: boolean) {
    if (!ctx) return


    animationId = requestAnimationFrame(() => animate(multiPlayer));
    const isDark = document.documentElement.classList.contains("dark");
    ctx!.fillStyle = isDark ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)";
    ctx!.fillRect(0, 0, canvas.current!.width, canvas.current!.height);
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
          bullet.x - bullet.radius > canvas.current!.width ||
          bullet.y + bullet.radius < 0 ||
          bullet.y - bullet.radius > canvas.current!.height
        ) {
          bulletsArray.splice(bIndex, 1);
          continue;
        }

        // Remove enemies and bullets on collision
        if (dist - enemy.radius - bullet.radius < 1) {
          score = String(Number(score) + 5);
          scoreElement.current!.innerHTML = String(score);

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
                ctx!
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
      if (multiPlayer) {
        const distFromPlayer1 = Math.hypot(
          playersArray[0].x - enemy.x,
          playersArray[0].y - enemy.y
        );

        const distFromPlayer2 = Math.hypot(
          playersArray[1].x - enemy.x,
          playersArray[1].y - enemy.y
        );

        if (distFromPlayer1 - enemy.radius - playersArray[0].radius < 1) {
          endGame();
          if (playerNumber === 1) {
            lostElement.current!.style.display = "block";
          } else {
            wonElement.current!.style.display = "block";
          }
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                event: "endGame",
                data: {
                  roomId,
                },
              })
            );
          }
        }

        if (distFromPlayer2 - enemy.radius - playersArray[1].radius < 1) {
          endGame();
          if (playerNumber === 2) {
            lostElement.current!.style.display = "block";
          } else {
            wonElement.current!.style.display = "block";
          }
        }
      } else {
        const distFromPlayer = Math.hypot(
          playersArray[0].x - enemy.x,
          playersArray[0].y - enemy.y
        );
        if (distFromPlayer - enemy.radius - playersArray[0].radius < 1) {
          endGame();
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                event: "endGame",
                data: {
                  roomId,
                },
              })
            );
          }
        }
      }
    }
  }

  const singlePlayerHandler = () => {
    multiplayer = false;
    createPlayer();
    updateGameColors();
    setCanvasSize(canvas.current!, ctx!);
    init();
    animate(false);
    const intervalId = spawnEnemies(canvas.current!, enemiesArray, ctx!);
    spawnEnemyIntervalId = intervalId;
    if (gameModal.current)
      gameModal.current.style.display = "none";
  }

  const multiPlayerHandler = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }

    multiplayer = true;
    setCanvasSize(canvas.current!, ctx!);
    wonElement.current!.style.display = "none";
    lostElement.current!.style.display = "none";

    ws = new WebSocket(import.meta.env.VITE_SOCKET_URL!);
    ws.onopen = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
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
      }
    };

    ws.onclose = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            event: "endGame",
            data: {
              roomId,
            },
          })
        );
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.event) {
        case "start": {
          const data = message.data;
          playerId = data.player.id;
          roomId = data.player.roomId;
          playerNumber = data.player.number;
          createPlayer();
          updateGameColors();
          init();
          animate(true);
          gameModal.current!.style.display = "none";

          break;
        }

        case "createEnemy": {
          const data = message.data.enemy;
          const velocity = {
            x: Math.cos(data.angle) * 2,
            y: Math.sin(data.angle) * 2,
          };
          enemiesArray.push(
            new Enemy(data.x, data.y, data.radius, data.color, velocity, ctx!)
          );
          break;
        }

        case "fireBullet": {
          const data = message.data.bullet;
          bulletsArray.push(
            new Bullet(data.x, data.y, data.radius, data.velocity, ctx!)
          );
          break;
        }
      }
    };
  }
  return (
    <>
      <div
        className="fixed text-black dark:text-white w-full flex items-center justify-between text-sm select-none pt-2 px-4"
      >
        <div className="flex items-center">
          <span>Score: </span>
          <span id="scoreElement" ref={scoreElement} className="ml-1">0</span>
        </div>

        <button
          id="darkModeToggle"
          onClick={() => darkModeToggle()}
          className="px-4 py-2 bg-green-500/10 rounded-lg dark:bg-white/10 z-50"
        >
          <span className="dark:hidden">
            {/* <!-- moon svg --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-moon"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </span>
          <span className="hidden dark:inline">
            {/* <!-- sun svg --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sun"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </span>
        </button>
      </div>

      {/* <!-- score modal --> */}
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center select-none"
        id="gameModal"
        ref={gameModal}
      >
        <div
          className="backdrop-blur-md text-black bg-green-500/10 dark:text-white dark:bg-white/10 max-w-md w-full p-12 rounded-lg text-center"
        >
          <h1 className="text-7xl leading-none font-bold" id="endScore" ref={endScore}>0</h1>
          <p className="mb-4 text-sm text-gray-800 dark:text-gray-300">Points</p>
          <p className="text-red-500 text-xl hidden" ref={lostElement} id="lostElement">YOU LOST</p>
          <p className="text-green-500 text-xl hidden" ref={wonElement} id="wonElement">YOU WON</p>
          <div>
            <button
              className="w-full rounded-full bg-green-500/50 dark:bg-black/50 p-3"
              id="singlePlayer"
              onClick={() => singlePlayerHandler()}
            >
              SinglePlayer
            </button>
            <button
              className="w-full rounded-full bg-green-500/50 dark:bg-black/50 p-3 mt-4"
              id="multiPlayer"
              onClick={() => multiPlayerHandler()}
            >
              MultiPlayer
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvas} id="canvas"></canvas>
    </>
  )
}

export default App
