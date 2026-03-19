let tablero = Array(8).fill().map(() => Array(8).fill(" "));

function mostrarTablero() {
    let contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        let fila = document.createElement("div");

        for (let j = 0; j < 8; j++) {
            let celda = crearCelda(); 
            
            // Usamos la nueva función para los colores
            aplicarColorCasilla(celda, i, j);

            celda.textContent = tablero[i][j];
            fila.appendChild(celda);
        }
        contenedor.appendChild(fila);
    }
}

// Función 1: Crea el elemento y sus dimensiones
function crearCelda() {
    let celda = document.createElement("div");
    celda.style.width = "40px";
    celda.style.height = "40px";
    celda.style.display = "inline-block";
    celda.style.textAlign = "center";
    celda.style.lineHeight = "40px";
    celda.style.verticalAlign = "top"; // Ayuda a que no se descuadren
    
    return celda;
}

// Función 2: Se encarga exclusivamente de la lógica visual del color
function aplicarColorCasilla(celda, fila, columna) {
    if ((fila + columna) % 2 === 0) {
        celda.style.backgroundColor = "#eee";
        celda.style.color = "black";
    } else {
        celda.style.backgroundColor = "#000000";
        celda.style.color = "white";
    }
}

mostrarTablero();