"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./classes/index");
const canvasSize_1 = require("./utils/canvasSize");
const spawnEnemies_1 = __importDefault(require("./gameLogic/spawnEnemies"));
const gsap_1 = __importDefault(require("gsap"));
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {
    antialias: true,
});
const scoreElement = document.getElementById("scoreElement");
const gameModal = document.getElementById("gameModal");
const startBtn = document.getElementById("startBtn");
const endScore = document.getElementById("endScore");
const darkModeToggle = document.getElementById("darkModeToggle");
addEventListener("resize", () => {
    (0, canvasSize_1.setCanvasSize)(canvas, ctx);
    location.reload();
});
// theme
if (localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
}
else {
    document.documentElement.classList.remove("dark");
}
darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    // Save preference
    if (document.documentElement.classList.contains("dark")) {
        localStorage.theme = "dark";
        player.color = "#ffffff"; // White color for player in dark mode
    }
    else {
        localStorage.theme = "light";
        player.color = "#000000"; // Black color for player in light mode
    }
});
let bulletsArray = [];
let enemiesArray = [];
let particlesArray = [];
let spawnEnemyIntervalId;
//all functions
function updateGameColors() {
    const isDark = document.documentElement.classList.contains("dark");
    player.color = isDark ? "#ffffff" : "#000000";
}
function init() {
    bulletsArray = [];
    enemiesArray = [];
    particlesArray = [];
    scoreElement.innerHTML = String(0);
    clearInterval(spawnEnemyIntervalId);
}
function endGame() {
    cancelAnimationFrame(animationId);
    gameModal.style.display = "flex";
    endScore.innerHTML = score;
    score = String(0);
}
// invoking player class
const player = new index_1.Player(innerWidth / 2, innerHeight / 2, 10, "white", ctx);
player.draw();
//animating
let animationId;
let score = String(0);
function animate() {
    animationId = requestAnimationFrame(animate);
    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    bulletsArray.forEach((eachBullet) => eachBullet.update());
    particlesArray.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particlesArray.splice(index, 1);
        }
        else {
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
            if (bullet.x + bullet.radius < 0 ||
                bullet.x - bullet.radius > canvas.width ||
                bullet.y + bullet.radius < 0 ||
                bullet.y - bullet.radius > canvas.height) {
                bulletsArray.splice(bIndex, 1);
                continue;
            }
            // Remove enemies and bullets on collision
            if (dist - enemy.radius - bullet.radius < 1) {
                score += 5;
                scoreElement.innerHTML = score;
                // Create particles/explosions on hit
                for (let i = 0; i < enemy.radius * 1.5; i++) {
                    particlesArray.push(new index_1.Particle(bullet.x, bullet.y, Math.random() * 2, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 8),
                        y: (Math.random() - 0.5) * (Math.random() * 8),
                    }, ctx));
                }
                if (enemy.radius - 10 > 8) {
                    gsap_1.default.to(enemy, {
                        radius: enemy.radius - 10,
                    });
                    bulletsArray.splice(bIndex, 1);
                }
                else {
                    enemiesArray.splice(eIndex, 1);
                    bulletsArray.splice(bIndex, 1);
                }
            }
        }
        // End game if enemy hits player
        const distFromPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distFromPlayer - enemy.radius - player.radius < 1) {
            endGame();
        }
    }
}
// making bullets on click
addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - innerHeight / 2, event.clientX - innerWidth / 2);
    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6,
    };
    bulletsArray.push(new index_1.Bullet(innerWidth / 2, innerHeight / 2, 5, velocity, ctx));
});
// start game
startBtn.addEventListener("click", () => {
    updateGameColors();
    (0, canvasSize_1.setCanvasSize)(canvas, ctx);
    init();
    animate();
    const intervalId = (0, spawnEnemies_1.default)(canvas, enemiesArray, ctx);
    spawnEnemyIntervalId = intervalId;
    gameModal.style.display = "none";
});
// handling screen resize
addEventListener("resize", () => {
    location.reload();
});
