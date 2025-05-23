import { Player, Particle, Bullet, Enemy } from "../classes/index";
import { setCanvasSize } from "../utils/canvasSize";
import spawnEnemies from "./spawnEnemies";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { images } from "../assets/avatars";
import { Home, RotateCcw } from "lucide-react";

function Game({
  gameMode,
  playerName,
}: {
  gameMode: "singlePlayer" | "multiPlayer" | null;
  playerName: string;
}) {
  enum multiPlayerLoadingInterface {
    Server = "connecting to server",
    Player = "connecting to player",
  }

  const a1 = images[0];

  //states
  const [bulletsArray, setBulletsArray] = useState<Bullet[]>([]);
  const [enemiesArray, setEnemiesArray] = useState<Enemy[]>([]);
  const [particlesArray, setParticlesArray] = useState<Particle[]>([]);
  const [playersArray, setPlayersArray] = useState<Player[]>([]);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [multiplayerLoading, setMultiplayerLoading] =
    useState<multiPlayerLoadingInterface | null>(null);
  const [score, setScore] = useState(0);
  const [roomId, setRoomId] = useState(0);
  const [playerId, setPlayerId] = useState(0);
  const [gameWon, setGameWon] = useState<boolean>(); // for multiplayer
  const [gameLost, setGameLost] = useState<boolean>(); // for multiplayer
  const [opponentName, setOppnentName] = useState<string>("no");
  const [opponentScore, setOpponentScore] = useState(0);

  // refs
  const wsRef = useRef<WebSocket | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gameModal = useRef<HTMLDivElement>(null);
  const multiPlayerRef = useRef<boolean>();
  const playerNumberRef = useRef<number>();
  const opponentAvatarRef = useRef<string>();
  const zapSoundRef = useRef<HTMLAudioElement>(null);

  let spawnEnemyIntervalId: () => void;
  useEffect(() => {
    if (canvas.current) {
      const context = canvas.current?.getContext("2d", {
        antialias: true,
      }) as CanvasRenderingContext2D;
      if (context) setCtx(context);
    }
  }, []);

  useEffect(() => {
    switch (localStorage.theme) {
      case "light": {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
        }
        break;
      }
      case "dark": {
        if (!document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.add("dark");
        }
        break;
      }
      case "system": {
        if (window.matchMedia("(prefers-color-scheme: dark)")) {
          if (!document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.add("dark");
          }
        } else {
          if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    const bulletEventListener = (event: MouseEvent) => {
      if (!ctx) return;
      const angle = Math.atan2(
        event.clientY - innerHeight / 2,
        event.clientX - innerWidth / 2
      );
      const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6,
      };
      if (multiPlayerRef.current === true) {
        if (wsRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              event: "fireBullet",
              data: {
                playerId,
                roomId,
                radius: 5,
                velocity,
              },
            })
          );
        }
      }
      const bulletX = multiPlayerRef.current
        ? playerNumberRef.current === 1
          ? innerWidth / 2 + 50
          : innerWidth / 2 - 50
        : innerWidth / 2;

      const newBullet = new Bullet(bulletX, innerHeight / 2, 5, velocity, ctx);

      bulletsArray.push(newBullet);
      playZapSound();
      console.log(bulletsArray);
    };

    window.addEventListener("click", bulletEventListener);
    return () => window.removeEventListener("click", bulletEventListener);
  }, [ctx, playerId, bulletsArray, playersArray, roomId]);

  function updateGameColors() {
    const isDark = document.documentElement.classList.contains("dark");
    playersArray[0].color = isDark ? "#ffffff" : "#000000";
    if (multiPlayerRef.current)
      playersArray[1].color = isDark ? "#ffffff" : "#000000";
  }
  function init() {
    setScore(0);
    setOpponentScore(0);
    console.log(
      "won:",
      gameWon,
      "lost: ",
      gameLost,
      "number: ",
      playerNumberRef.current
    );

    if (spawnEnemyIntervalId) spawnEnemyIntervalId();
  }
  function endGame() {
    setBulletsArray([]);
    setEnemiesArray([]);
    setParticlesArray([]);
    setPlayersArray([]);
    gameMode = null;
    console.log(
      "won:",
      gameWon,
      "lost: ",
      gameLost,
      "number: ",
      playerNumberRef.current
    );
    cancelAnimationFrame(animationId);
    if (gameModal.current) gameModal.current.style.display = "flex";
  }
  // invoking player class
  function createPlayer() {
    if (multiPlayerRef.current) {
      // Ensure the players array has space for two players
      if (!playersArray[0]) {
        playersArray[0] = new Player(
          innerWidth / 2 + 50,
          innerHeight / 2,
          innerWidth > 700 ? 30 : 20,
          "white",
          ctx!,
          playerNumberRef.current === 1
            ? localStorage.avatar
            : opponentAvatarRef.current
        );
      }
      if (!playersArray[1]) {
        playersArray[1] = new Player(
          innerWidth / 2 - 50,
          innerHeight / 2,
          innerWidth > 700 ? 30 : 20,
          "white",
          ctx!,
          playerNumberRef.current === 2
            ? localStorage.avatar
            : opponentAvatarRef.current
        );
      }
    } else {
      // Ensure only one player exists in single-player mode
      if (!playersArray[0]) {
        playersArray[0] = new Player(
          innerWidth / 2,
          innerHeight / 2,
          innerWidth > 700 ? 30 : 20,
          "white",
          ctx!,
          localStorage.avatar || a1
        );
      }
    }

    // Draw all players
    playersArray.forEach((player) => player.draw());
  }
  //animating
  let animationId: number;
  addEventListener("resize", () => {
    setCanvasSize(canvas.current!, ctx!);
    location.reload();
  });
  function animate() {
    if (!ctx) return;
    animationId = requestAnimationFrame(() => animate());
    const isDark = document.documentElement.classList.contains("dark");
    ctx!.fillStyle = isDark ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)";
    ctx!.fillRect(0, 0, canvas.current!.width, canvas.current!.height);
    ctx.fillStyle = "white";

    bulletsArray.forEach((eachBullet) => eachBullet.update());
    particlesArray.forEach((particle, index) => {
      if (particle.opacity <= 0) {
        particlesArray.splice(index, 1);
      } else {
        particle.update();
      }
    });
    playersArray[0].draw();
    if (multiPlayerRef.current) playersArray[1].draw();
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
          if (bullet.opponentBullet) {
            setOpponentScore((prev) => prev + 5);
          } else {
            setScore((prev) => prev + 5);
          }

          // Create particles/explosions on hit
          for (
            let i = 0;
            i < enemy.radius * (innerWidth < 800 ? 1 : 1.5);
            i++
          ) {
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
      if (multiPlayerRef.current) {
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
          if (playerNumberRef.current === 1) {
            setGameLost(true);
          } else {
            setGameWon(true);
          }
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
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
          if (playerNumberRef.current === 2) {
            setGameLost(true);
          } else {
            setGameWon(true);
          }
        }
      } else {
        const distFromPlayer = Math.hypot(
          playersArray[0].x - enemy.x,
          playersArray[0].y - enemy.y
        );
        if (distFromPlayer - enemy.radius - playersArray[0].radius < 1) {
          endGame();
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
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
    multiPlayerRef.current = false;
    createPlayer();
    updateGameColors();
    setCanvasSize(canvas.current!, ctx!);
    init();
    animate();
    const intervalId = spawnEnemies(canvas.current!, enemiesArray, ctx!);
    spawnEnemyIntervalId = intervalId;
    if (gameModal.current) gameModal.current.style.display = "none";
  };
  const multiPlayerHandler = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setMultiplayerLoading(multiPlayerLoadingInterface.Server);
    multiPlayerRef.current = true;
    setCanvasSize(canvas.current!, ctx!);
    setGameLost(false);
    setGameWon(false);
    wsRef.current = new WebSocket(import.meta.env.VITE_SOCKET_URL!);
    wsRef.current.onopen = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            event: "init",
            data: {
              name: playerName,
              canvasWidth: innerWidth,
              canvasHeight: innerHeight,
              avatar: localStorage.avatar,
            },
          })
        );

        setMultiplayerLoading(multiPlayerLoadingInterface.Player);
      }
    };
    wsRef.current.onclose = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            event: "endGame",
            data: {
              roomId,
            },
          })
        );
      }
    };
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.event) {
        case "start": {
          setMultiplayerLoading(null);
          const data = message.data;
          setPlayerId(data.player.id);
          setRoomId(data.player.roomId);
          playerNumberRef.current = data.player.number;
          opponentAvatarRef.current = data.opponent.avatar;
          setOppnentName(data.opponent.name);
          createPlayer();
          updateGameColors();
          init();
          animate();
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
            new Bullet(
              playerNumberRef.current === 1
                ? innerWidth / 2 - 50
                : innerWidth / 2 + 50,
              innerHeight / 2,
              data.radius,
              data.velocity,
              ctx!,
              true
            )
          );
          playZapSound();

          break;
        }
      }
    };
  };

  useEffect(() => {
    if (!ctx) return;
    console.log(gameMode);

    if (gameMode) {
      switch (gameMode) {
        case "singlePlayer": {
          singlePlayerHandler();
          break;
        }
        case "multiPlayer": {
          multiPlayerHandler();
          break;
        }
      }
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [ctx, gameMode]);

  const playZapSound = () => {
    if (zapSoundRef.current) {
      zapSoundRef.current.currentTime = 0;
      zapSoundRef.current.volume = 0.3;
      zapSoundRef.current
        .play()
        .catch((err) => console.error("Zap sound play failed:", err));
    }
  };
  return (
    <>
      <div className="fixed text-black dark:text-white w-full flex items-center justify-between text-sm select-none pt-2 px-4">
        <div
          className={`flex-col items-center ${
            multiPlayerRef.current && playerNumberRef.current === 2
              ? "text-amber-500"
              : null
          } `}
        >
          <div>
            {multiPlayerRef.current
              ? playerNumberRef.current === 1
                ? playerName
                : opponentName
              : null}
          </div>
          <div className="flex items-center">
            <span>Score: </span>
            <span id="scoreElement" className="ml-1">
              {multiPlayerRef.current
                ? playerNumberRef.current === 2
                  ? score
                  : opponentScore
                : score}
            </span>
          </div>
        </div>
        {multiPlayerRef.current && (
          <div
            className={`flex-col items-center ${
              multiPlayerRef.current && playerNumberRef.current === 1
                ? "text-amber-500"
                : null
            } `}
          >
            <div>
              {multiPlayerRef.current
                ? playerNumberRef.current === 2
                  ? playerName
                  : opponentName
                : null}
            </div>
            <div className="flex items-center">
              <span>Score: </span>
              <span id="scoreElement" className="ml-1">
                {multiPlayerRef.current
                  ? playerNumberRef.current === 1
                    ? score
                    : opponentScore
                  : score}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* <!-- score modal --> */}
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center select-none"
        id="gameModal"
        ref={gameModal}
      >
        <div className="backdrop-blur-md text-black bg-green-500/10 dark:text-white dark:bg-white/10 max-w-md w-full p-12 rounded-lg text-center">
          <h1 className="text-7xl leading-none font-bold" id="endScore">
            {score}
          </h1>
          <p className="mb-4 text-sm text-gray-800 dark:text-gray-300">
            Points
          </p>
          <p
            className={`${
              gameLost ? "block" : "hidden"
            }  text-red-500 text-xl `}
            id="lostElement"
          >
            YOU LOST
          </p>
          <p
            className={`${
              gameWon ? "block" : "hidden"
            } text-green-500 text-xl `}
            id="wonElement"
          >
            YOU WON
          </p>
          <div>
            <button
              className="w-full rounded-full cursor-pointer bg-green-500/50 dark:bg-black/50 p-3"
              id="singlePlayer"
              onClick={() => {
                if (gameMode === "singlePlayer") {
                  singlePlayerHandler();
                } else {
                  multiPlayerHandler();
                }
              }}
            >
              {gameMode === "multiPlayer" ? (
                multiplayerLoading === null ? (
                  <div className="flex items-center justify-center gap-2">
                    <RotateCcw className="text-white" />
                    <span>Play Again</span>
                  </div>
                ) : multiplayerLoading ===
                  multiPlayerLoadingInterface.Server ? (
                  "connecting to server..."
                ) : (
                  "finding players..."
                )
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="text-white w-6 h-6" />
                  <span>Play Again</span>
                </div>
              )}
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-full bg-green-500/50 dark:bg-black/50 p-3 mt-4"
              id="multiPlayer"
              onClick={() => window.location.reload()}
              disabled={multiplayerLoading !== null ? true : false}
            >
              <Home className="w-6 h-6" /> Home
            </button>
          </div>
        </div>
      </div>
      <audio ref={zapSoundRef} src="/zap.wav" preload="auto" />
      <canvas ref={canvas} id="canvas"></canvas>
    </>
  );
}
export default Game;
