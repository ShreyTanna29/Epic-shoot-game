import { Enemy } from "../classes";

export default function spawnEnemies(
  canvas: HTMLCanvasElement,
  enemiesArray: Enemy[],
  ctx: CanvasRenderingContext2D
) {
  let lastSpawnTime = Date.now();
  const spawnDelay = 1000; // 1 second

  function spawn() {
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime >= spawnDelay) {
      const radius = Math.random() * (25 - 8) + 8;
      let x, y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * (canvas.height - radius * 2) + radius;
      } else {
        x = Math.random() * (canvas.width - radius * 2) + radius;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }

      const color = `hsl(${Math.random() * 360},50%,50%)`;
      const angle = Math.atan2(innerHeight / 2 - y, innerWidth / 2 - x);
      const velocity = {
        x: Math.cos(angle) * 2,
        y: Math.sin(angle) * 2,
      };

      enemiesArray.push(new Enemy(x, y, radius, color, velocity, ctx));
      lastSpawnTime = currentTime;
    }
    return requestAnimationFrame(spawn);
  }

  const animationId = spawn();
  return () => cancelAnimationFrame(animationId);
}
