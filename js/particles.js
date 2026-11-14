/**
 * =========================================================================
 * PARTICLE ENGINE & VISUAL EFFECTS
 * =========================================================================
 * Provides ambient floating hearts, twinkling sparkles, gentle butterflies,
 * and celebratory confetti bursts. Pure Canvas 2D, zero dependencies.
 */

class AmbientParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.butterflies = [];
        this.isActive = true;
        this.lastTime = performance.now();

        this.palette = [
            'rgba(255, 107, 139, 0.6)',  // Pink
            'rgba(161, 140, 209, 0.6)',  // Lavender
            'rgba(79, 172, 254, 0.6)',   // Sky Blue
            'rgba(254, 225, 64, 0.6)',   // Sunshine Yellow
            'rgba(255, 160, 122, 0.6)',  // Peach
            'rgba(168, 237, 234, 0.6)'   // Mint Green
        ];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Create initial floating particles
        const count = Math.min(35, Math.floor(window.innerWidth / 35));
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(true));
        }

        // Add 2 gentle butterflies
        for (let i = 0; i < 2; i++) {
            this.butterflies.push(this.createButterfly());
        }

        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (this.isActive) {
                this.lastTime = performance.now();
                this.animate();
            }
        });

        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(randomY = false) {
        const types = ['heart', 'sparkle', 'bubble', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 20,
            size: 8 + Math.random() * 14,
            speedY: 0.4 + Math.random() * 0.8,
            speedX: (Math.random() - 0.5) * 0.5,
            opacity: 0.3 + Math.random() * 0.5,
            color: this.palette[Math.floor(Math.random() * this.palette.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            type: type,
            pulse: Math.random() * Math.PI * 2
        };
    }

    createButterfly() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: 14 + Math.random() * 6,
            speedX: 1 + Math.random() * 1.5,
            speedY: (Math.random() - 0.5) * 1,
            wingAngle: 0,
            wingSpeed: 0.15 + Math.random() * 0.1,
            color: this.palette[Math.floor(Math.random() * this.palette.length)]
        };
    }

    drawHeart(x, y, size, color, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(0, topCurveHeight);
        this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
        this.ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawSparkle(x, y, size, color, pulse) {
        this.ctx.save();
        this.ctx.translate(x, y);
        const s = size * (0.8 + 0.3 * Math.sin(pulse));
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s);
        this.ctx.quadraticCurveTo(0, 0, s, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, s);
        this.ctx.quadraticCurveTo(0, 0, -s, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, -s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawStar(x, y, size, color, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            this.ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size, -Math.sin((18 + i * 72) * Math.PI / 180) * size);
            this.ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (size * 0.45), -Math.sin((54 + i * 72) * Math.PI / 180) * (size * 0.45));
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawBubble(x, y, size, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawButterfly(b) {
        this.ctx.save();
        this.ctx.translate(b.x, b.y);
        const wingScale = Math.cos(b.wingAngle);

        this.ctx.fillStyle = b.color;
        // Left wing
        this.ctx.beginPath();
        this.ctx.ellipse(-b.size * 0.5 * Math.abs(wingScale), -b.size * 0.3, b.size * 0.6 * Math.abs(wingScale), b.size * 0.8, -0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Right wing
        this.ctx.beginPath();
        this.ctx.ellipse(b.size * 0.5 * Math.abs(wingScale), -b.size * 0.3, b.size * 0.6 * Math.abs(wingScale), b.size * 0.8, 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Body
        this.ctx.fillStyle = 'rgba(80, 60, 90, 0.7)';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 2, b.size * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        if (!this.isActive) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update & draw ambient particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.y -= p.speedY;
            p.x += Math.sin(p.pulse) * 0.4 + p.speedX;
            p.rotation += p.rotSpeed;
            p.pulse += 0.03;

            if (p.type === 'heart') {
                this.drawHeart(p.x, p.y, p.size, p.color, p.rotation);
            } else if (p.type === 'sparkle') {
                this.drawSparkle(p.x, p.y, p.size, p.color, p.pulse);
            } else if (p.type === 'star') {
                this.drawStar(p.x, p.y, p.size * 0.7, p.color, p.rotation);
            } else {
                this.drawBubble(p.x, p.y, p.size, p.color);
            }

            // Recycle if particle floats above screen
            if (p.y < -30) {
                this.particles[i] = this.createParticle(false);
            }
        }

        // Update & draw butterflies
        for (let i = 0; i < this.butterflies.length; i++) {
            const b = this.butterflies[i];
            b.x += b.speedX;
            b.y += Math.sin(b.wingAngle * 0.5) * 1.5;
            b.wingAngle += b.wingSpeed;

            this.drawButterfly(b);

            // Wrap around screen
            if (b.x > this.canvas.width + 50) {
                b.x = -50;
                b.y = Math.random() * (this.canvas.height * 0.7);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * Confetti Cannon - Pure HTML5 Canvas Celebratory Explosions
 */
class ConfettiCannon {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confettiCanvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.pieces = [];
        this.animId = null;

        this.colors = [
            '#FF6B8B', '#FF8E9E', '#A18CD1', '#E0C3FC',
            '#4FACFE', '#00F2FE', '#FEE140', '#FFA07A', '#A8EDEA'
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 120) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 6 + Math.random() * 12;
            this.pieces.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 3,
                size: 6 + Math.random() * 8,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                gravity: 0.28,
                drag: 0.96,
                life: 1.0,
                decay: 0.007 + Math.random() * 0.008,
                shape: Math.random() > 0.3 ? 'rect' : 'circle'
            });
        }

        if (!this.animId) {
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.rotation += p.rotSpeed;
            p.life -= p.decay;

            if (p.life <= 0 || p.y > this.canvas.height + 20) {
                this.pieces.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        if (this.pieces.length > 0) {
            this.animId = requestAnimationFrame(() => this.animate());
        } else {
            this.animId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

window.AmbientParticleEngine = AmbientParticleEngine;
window.ConfettiCannon = ConfettiCannon;

