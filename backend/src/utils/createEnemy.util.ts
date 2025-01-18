import { Enemy } from 'src/types/enemy.type';

export const createEnemy = (
  canvasWidth: number,
  canvasHeight: number,
): Enemy => {
  const id = Math.random();
  const radius = Math.random() * (25 - 8) + 8;
  const x = Math.random() < 0.5 ? 0 - radius : canvasWidth + radius;
  const y = Math.random() * (canvasHeight - radius * 2) + radius;
  const color = `hsl(${Math.random() * 360},50%,50%)`;
  const angle = Math.atan2(canvasHeight / 2 - y, canvasWidth / 2 - x);

  return { id, x, y, radius, color, angle };
};
