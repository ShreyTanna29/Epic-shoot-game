"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
class Enemy {
    constructor(x, y, radius, color, velocity, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
exports.Enemy = Enemy;
