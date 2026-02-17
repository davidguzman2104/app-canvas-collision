const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight / 2;
const window_width = window.innerWidth / 2;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "rgb(88, 240, 108)";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.baseColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;

        this.draw(context);
    }
}

// 🔥 Detecta colisión entre 2 círculos
function areColliding(c1, c2) {
    const dx = c2.posX - c1.posX;
    const dy = c2.posY - c1.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= (c1.radius + c2.radius);
}

// 🎯 Crear N círculos
const N = 12; // cambia este número y verás la magia
let circles = [];

for (let i = 0; i < N; i++) {
    let radius = Math.floor(Math.random() * 40 + 20);
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let speed = Math.random() * 3 + 1;

    circles.push(new Circle(x, y, radius, "blue", i + 1, speed));
}

// 🎬 Animación
function updateCircle() {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, window_width, window_height);

    // Resetear colores
    circles.forEach(c => c.color = c.baseColor);

    // Comparar todos contra todos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (areColliding(circles[i], circles[j])) {
                circles[i].color = "red";
                circles[j].color = "red";
            }
        }
    }

    // Actualizar y dibujar
    circles.forEach(c => c.update(ctx));
}

updateCircle();