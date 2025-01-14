"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
class Bullet {
    constructor(x, y, radius, velocity, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        const isDark = document.documentElement.classList.contains("dark");
        this.ctx.fillStyle = `${isDark ? "white" : "black"}`;
        this.ctx.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
exports.Bullet = Bullet;
