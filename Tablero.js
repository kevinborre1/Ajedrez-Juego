let tablero = Array(8).fill().map(() => Array(8).fill(" "));


function mostrarTablero() {
    let contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        let fila = document.createElement("div");

        for (let j = 0; j < 8; j++) {
            let celda = document.createElement("div");
            celda.style.width = "40px";
            celda.style.height = "40px";
            celda.style.display = "inline-block";
            celda.style.textAlign = "center";
            celda.style.lineHeight = "40px";

            // colores ajedrez
            if ((i + j) % 2 === 0) {
                celda.style.backgroundColor = "#eee";
            } else {
                celda.style.backgroundColor = "#000000";
                celda.style.color = "white";
            }

            celda.textContent = tablero[i][j];
            fila.appendChild(celda);
        }

        contenedor.appendChild(fila);
    }
}


mostrarTablero();