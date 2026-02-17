// Obtiene el elemento <canvas> del HTML por su id
const canvas = document.getElementById("canvas");

// Obtiene el contexto 2D para poder dibujar en el canvas
let ctx = canvas.getContext("2d");

// Toma la mitad del alto de la ventana del navegador
const window_height = window.innerHeight / 2;

// Toma la mitad del ancho de la ventana del navegador
const window_width = window.innerWidth / 2;

// Asigna esas dimensiones al canvas
canvas.height = window_height;
canvas.width = window_width;

// ✅ AGREGADO: asegura que el tamaño visible (CSS) coincida con el tamaño real del canvas
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

// Define el color de fondo del canvas
canvas.style.background = "rgb(88, 240, 108)";


// ======================= CLASE CIRCLE =======================
class Circle {

    // Constructor que se ejecuta al crear cada círculo
    constructor(x, y, radius, color, text, speed) {

        this.posX = x;          // Posición horizontal inicial del círculo
        this.posY = y;          // Posición vertical inicial del círculo
        this.radius = radius;   // Radio del círculo
        this.baseColor = color; // Color original del círculo
        this.color = color;     // Color actual (cambia en colisión)
        this.text = text;       // Texto que se dibuja dentro del círculo

        // Velocidades en X y Y con dirección aleatoria
        this.dx = (Math.random() < 0.5 ? -1 : 1) * speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * speed;
    }

    // Método que dibuja el círculo y su texto
    draw(context) {
        context.beginPath();                  // Inicia un nuevo trazo
        context.strokeStyle = this.color;    // Define el color del borde

        context.textAlign = "center";        // Centra el texto horizontalmente
        context.textBaseline = "middle";     // Centra el texto verticalmente
        context.font = "20px Arial";         // Tipo y tamaño de fuente

        context.fillText(this.text, this.posX, this.posY); // Dibuja el número

        context.lineWidth = 2;               // Grosor del borde
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2); // Dibuja el círculo completo
        context.stroke();                    // Pinta el borde
        context.closePath();                 // Cierra el trazo
    }

    // Método que actualiza la posición del círculo y controla rebotes con paredes
    update(context) {

        // Si toca pared derecha o izquierda, invierte dirección horizontal
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx *= -1;
        }

        // Si toca techo o piso, invierte dirección vertical
        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy *= -1;
        }

        // Actualiza la posición sumando la velocidad
        this.posX += this.dx;
        this.posY += this.dy;

        // Dibuja el círculo en su nueva posición
        this.draw(context);
    }
}


// ======================= DETECCIÓN DE COLISIÓN =======================

// Función que calcula si dos círculos están colisionando
function areColliding(c1, c2) {

    const dx = c2.posX - c1.posX; // Diferencia horizontal entre centros
    const dy = c2.posY - c1.posY; // Diferencia vertical entre centros

    // Distancia entre centros usando Pitágoras
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Si la distancia es menor o igual a la suma de radios, colisionan
    return distance <= (c1.radius + c2.radius);
}


// ======================= RESOLVER COLISIÓN FÍSICA =======================

// Función que aplica el rebote físico real entre dos círculos
function resolveCollision(c1, c2) {

    // Vector entre los centros
    const dx = c2.posX - c1.posX;
    const dy = c2.posY - c1.posY;

    // Distancia entre centros
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Vector normal (dirección del choque)
    const nx = dx / distance;
    const ny = dy / distance;

    // Proyección de velocidades sobre la normal (choque elástico)
    const p =
        2 *
        (c1.dx * nx + c1.dy * ny - c2.dx * nx - c2.dy * ny) /
        2;

    // Intercambio de velocidades en la dirección del impacto
    c1.dx = c1.dx - p * nx;
    c1.dy = c1.dy - p * ny;
    c2.dx = c2.dx + p * nx;
    c2.dy = c2.dy + p * ny;

    // Calcula cuánto se están encimando
    const overlap = (c1.radius + c2.radius) - distance;

    // Los separa para evitar que queden pegados
    c1.posX -= overlap * nx / 2;
    c1.posY -= overlap * ny / 2;
    c2.posX += overlap * nx / 2;
    c2.posY += overlap * ny / 2;

    // Cambia de color al colisionar
    c1.color = "red";
    c2.color = "red";
}


// ======================= CREAR N CÍRCULOS =======================

const N = 12;        // Cantidad de círculos en pantalla
let circles = [];    // Arreglo que almacenará todos los círculos

for (let i = 0; i < N; i++) {

    let radius = Math.floor(Math.random() * 30 + 20); // Radio aleatorio

    // Posiciones aleatorias sin salirse del canvas
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;

    let speed = Math.random() * 3 + 1; // Velocidad aleatoria

    // Se agrega el círculo al arreglo
    circles.push(new Circle(x, y, radius, "blue", i + 1, speed));
}


// ======================= ANIMACIÓN PRINCIPAL =======================

function updateCircle() {

    requestAnimationFrame(updateCircle); // Llama al siguiente frame

    ctx.clearRect(0, 0, window_width, window_height); // Limpia el canvas

    // Restaura el color original antes de verificar colisiones
    circles.forEach(c => c.color = c.baseColor);

    // Compara todos los círculos entre sí
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {

            // Si colisionan, aplica rebote físico
            if (areColliding(circles[i], circles[j])) {
                resolveCollision(circles[i], circles[j]);
            }
        }
    }

    // Actualiza posición y dibuja cada círculo
    circles.forEach(c => c.update(ctx));
}

// Inicia la animación
updateCircle();
