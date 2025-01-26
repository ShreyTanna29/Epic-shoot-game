import { Particle } from "../classes";

import gsap from "gsap";
import endGame from "./endGame";
import { useGameStore } from "../store/store";

export default function animate(
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D,
  roomId: number,
  ws: WebSocket
) {
  if (!ctx) return;

  const store = useGameStore.getState();
  const {
    setAnimationId,
    players,
    bullets,
    multiplayer,
    particles,
    enemies,
    removeBullet,
    setScore,
    score,
    playerNumber,
    setGameLost,
    setGameWon,
  } = store;

  const NewAnimationId = requestAnimationFrame(() =>
    animate(canvas, ctx, roomId, ws)
  );
  setAnimationId(NewAnimationId);
  const isDark = document.documentElement.classList.contains("dark");
  ctx!.fillStyle = isDark ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)";
  ctx!.fillRect(0, 0, canvas.current!.width, canvas.current!.height);
  players[0].draw();
  if (multiplayer) players[1].draw();

  bullets.forEach((eachBullet) => eachBullet.update());

  particles.forEach((particle, index) => {
    if (particle.opacity <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  for (let eIndex = enemies.length - 1; eIndex >= 0; eIndex--) {
    const enemy = enemies[eIndex];
    enemy.update();

    for (let bIndex = bullets.length - 1; bIndex >= 0; bIndex--) {
      const bullet = bullets[bIndex];
      const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

      // Remove bullets if they go off-screen
      if (
        bullet.x + bullet.radius < 0 ||
        bullet.x - bullet.radius > canvas.current!.width ||
        bullet.y + bullet.radius < 0 ||
        bullet.y - bullet.radius > canvas.current!.height
      ) {
        removeBullet(bIndex);
        continue;
      }

      // Remove enemies and bullets on collision
      if (dist - enemy.radius - bullet.radius < 1) {
        setScore(score + 5);

        // Create particles/explosions on hit
        for (let i = 0; i < enemy.radius * (innerWidth < 800 ? 1 : 1.5); i++) {
          particles.push(
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
          bullets.splice(bIndex, 1);
        } else {
          enemies.splice(eIndex, 1);
          removeBullet(bIndex);
        }
      }
    }

    // End game if enemy hits player
    if (multiplayer) {
      const distFromPlayer1 = Math.hypot(
        players[0].x - enemy.x,
        players[0].y - enemy.y
      );

      const distFromPlayer2 = Math.hypot(
        players[1].x - enemy.x,
        players[1].y - enemy.y
      );

      if (distFromPlayer1 - enemy.radius - players[0].radius < 1) {
        endGame();
        if (playerNumber === 1) {
          setGameLost(true);
        } else {
          setGameWon(true);
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

      if (distFromPlayer2 - enemy.radius - players[1].radius < 1) {
        endGame();
        if (playerNumber === 2) {
          setGameLost(true);
        } else {
          setGameWon(true);
        }
      }
    } else {
      const distFromPlayer = Math.hypot(
        players[0].x - enemy.x,
        players[0].y - enemy.y
      );
      if (distFromPlayer - enemy.radius - players[0].radius < 1) {
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
