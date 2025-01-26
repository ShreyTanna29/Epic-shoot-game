import { Player, Bullet, Enemy } from "./classes/index";
import { setCanvasSize } from "./utils/canvasSize";
import spawnEnemies from "./gameLogic/spawnEnemies";
import { useEffect, useRef, useState } from "react";
import animate from "./gameLogic/animate";
import { useGameStore } from "./store/store";


function App() {

  const [ws, setWs] = useState<WebSocket | null>(null)

  const {
    players,
    enemies,
    score,
    multiplayer,
    gameStarted,
    gameLost,
    gameWon,
    addBullet,
    setMultiplayer,
    setGameWon,
    setGameLost,
    addEnemy,
    setGameStarted,
    addPlayer,
    clearArrays
  } = useGameStore()

  const canvas = useRef<HTMLCanvasElement>(null)
  let spawnEnemyIntervalId: () => void;
  let playerId: number;
  let roomId: number;
  let playerNumber: number;
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvas.current) {
      const context = canvas.current?.getContext('2d', { antialias: true }) as CanvasRenderingContext2D
      if (context) setCtx(context);
    }
  }, [canvas]);

  useEffect(() => {
    if (!ctx) return

    const bulletEventListener = (event: MouseEvent) => {
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
          addBullet(new Bullet(innerWidth / 2 + 50, innerHeight / 2, 5, velocity, ctx!))
        } else {
          addBullet(new Bullet(innerWidth / 2 - 50, innerHeight / 2, 5, velocity, ctx!))
        }
      } else {
        addBullet(new Bullet(innerWidth / 2, innerHeight / 2, 5, velocity, ctx!))
      }
    }

    window.addEventListener("click", (event) => bulletEventListener(event))

    return () => window.removeEventListener("click", bulletEventListener)

  }, [ctx, multiplayer, ws])


  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  })

  const darkModeToggle = () => {
    document.documentElement.classList.toggle("dark");

    // Save preference
    if (document.documentElement.classList.contains("dark")) {
      localStorage.theme = "dark";
      players[0].color = "#ffffff"; // White color for player in dark mode
      if (multiplayer) players[1].color = "#ffffff"; // White color for player in dark mode
    } else {
      localStorage.theme = "light";
      players[0].color = "#000000"; // Black color for player in light mode
      if (multiplayer) players[1].color = "#000000"; // Black color for player in light mode
    }
  }


  function updateGameColors() {
    const isDark = document.documentElement.classList.contains("dark");
    if (players.length > 0) {
      players[0].color = isDark ? "#ffffff" : "#000000";
      if (multiplayer) players[1].color = isDark ? "#ffffff" : "#000000";
    }
  }
  function init() {

    clearArrays()
    // if (scoreElement.current) scoreElement.current.innerHTML = String(0);
    setGameWon(false)
    setGameLost(false)
    if (spawnEnemyIntervalId) spawnEnemyIntervalId();
  }

  // invoking player class
  function createPlayer() {
    if (multiplayer) {
      const player1 = addPlayer(new Player(
        innerWidth / 2 + 50,
        innerHeight / 2,
        10,
        "white",
        ctx!
      ))

      player1.draw();

      const player2 = addPlayer(new Player(
        innerWidth / 2 - 50,
        innerHeight / 2,
        10,
        "white",
        ctx!
      ))

      player2.draw();
    } else {

      const player1 = addPlayer(new Player(
        innerWidth / 2,
        innerHeight / 2,
        10,
        "white",
        ctx!
      ));
      player1.draw();
    }
  }

  addEventListener("resize", () => {
    setCanvasSize(canvas.current!, ctx!);
    location.reload();
  });


  const singlePlayerHandler = () => {
    setMultiplayer(false)
    setCanvasSize(canvas.current!, ctx!);
    createPlayer();
    updateGameColors();
    init();
    animate(canvas, ctx!, roomId, ws!);
    const intervalId = spawnEnemies(canvas.current!, enemies, ctx!);
    spawnEnemyIntervalId = intervalId;
    setGameStarted(true)
  }

  const multiPlayerHandler = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      setWs(null);
    }
    const newWs = new WebSocket(import.meta.env.VITE_SOCKET_URL!)
    setWs(newWs)
    setMultiplayer(true)
    setGameWon(false)
    setGameLost(false)

    newWs.onopen = () => {
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

    newWs.onclose = () => {
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

    newWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.event) {
        case "start": {
          const data = message.data;
          playerId = data.player.id;
          roomId = data.player.roomId;
          playerNumber = data.player.number;
          setCanvasSize(canvas.current!, ctx!);
          createPlayer();
          updateGameColors();
          init();
          animate(canvas, ctx!, roomId, ws!);
          setGameStarted(true)

          break;
        }

        case "createEnemy": {
          const data = message.data.enemy;
          const velocity = {
            x: Math.cos(data.angle) * 2,
            y: Math.sin(data.angle) * 2,
          };
          addEnemy(new Enemy(data.x, data.y, data.radius, data.color, velocity, ctx!))
          break;
        }

        case "fireBullet": {
          const data = message.data.bullet;
          addBullet(new Bullet(data.x, data.y, data.radius, data.velocity, ctx!))
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
          <span id="scoreElement" className="ml-1">{score}</span>
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
        className={` ${gameStarted ? "hidden" : "flex"} fixed inset-0 backdrop-blur-sm  items-center justify-center select-none`}
        id="gameModal"
      >
        <div
          className="backdrop-blur-md text-black bg-green-500/10 dark:text-white dark:bg-white/10 max-w-md w-full p-12 rounded-lg text-center"
        >
          <h1 className="text-7xl leading-none font-bold" id="endScore">{score}</h1>
          <p className="mb-4 text-sm text-gray-800 dark:text-gray-300">Points</p>

          <p className={`${gameLost ? "block" : "hidden"} text-red-500 text-xl `} id="lostElement">YOU LOST</p>
          <p className={`${gameWon ? "block" : "hidden"} text-green-500 text-xl `} id="wonElement">YOU WON</p>
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
