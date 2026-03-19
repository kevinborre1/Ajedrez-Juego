let tablero = Array(8).fill().map(() => Array(8).fill(" "));

function mostrarTablero() {
    let contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let celda = crearCelda(); 
            aplicarColorCasilla(celda, i, j);
            celda.textContent = tablero[i][j];
            contenedor.appendChild(celda); // Agregamos directo al contenedor
        }
    }
}

function crearCelda() {
    let celda = document.createElement("div");
    celda.classList.add("celda"); // <--- AGREGAMOS ESTA CLASE
    return celda;
}

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