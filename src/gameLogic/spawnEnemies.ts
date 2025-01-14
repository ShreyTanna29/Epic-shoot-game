import { Enemy } from "../classes/index";
function spawnEnemies(
  canvas: HTMLCanvasElement,
  enemiesArray: Enemy[],
  ctx: CanvasRenderingContext2D
) {
  let spawnEnemyIntervalId = setInterval(() => {
    let radius = Math.random() * (30 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * (canvas.height - radius * 2) + radius;
    } else {
      x = Math.random() * (canvas.width - radius * 2) + radius;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    // creating enemies
    let color = `hsl(${Math.random() * 360},50%,50%)`;
    let angle = Math.atan2(innerHeight / 2 - y, innerWidth / 2 - x);

    let velocity = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2,
    };

    enemiesArray.push(new Enemy(x, y, radius, color, velocity, ctx));
  }, 1000);

  return spawnEnemyIntervalId;
}

export default spawnEnemies;
