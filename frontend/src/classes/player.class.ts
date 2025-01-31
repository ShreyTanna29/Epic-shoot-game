export class Player {
  private ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public radius: number;
  public color: string;
  public id: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    ctx: CanvasRenderingContext2D
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.id = crypto.getRandomValues(new Uint32Array(1))[0];
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}
