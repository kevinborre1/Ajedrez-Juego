class Tablero {
    constructor(logica) {
        this.logica = logica;
        this.contenedor = document.getElementById("tablero");
        this.controlador = null; // Se asignará al iniciar
    }

    setControlador(controlador) {
        this.controlador = controlador;
    }

    mostrarTablero(seleccion = null) {
        this.contenedor.innerHTML = "";
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const pieza = this.logica.tablero[i][j];
                const celda = document.createElement("div");
                celda.classList.add("celda");

                // Color de la celda
                celda.style.backgroundColor = (i + j) % 2 === 0 ? "#eee" : "#555";

                // Dibujar pieza si existe
                if (pieza) {
                    celda.textContent = this.obtenerIconoPieza(pieza);
                    celda.classList.add(pieza.color);
                }

                // Dibujar resalte de selección
                if (seleccion && seleccion.fila === i && seleccion.columna === j) {
                    celda.classList.add("seleccionada"); // Estilo vía CSS mejor
                }

                // Delegar clic al controlador
                celda.onclick = () => this.controlador.procesarClic(i, j);

                this.contenedor.appendChild(celda);
            }
        }
    }

    obtenerIconoPieza(pieza) {
        const iconos = {
            "Peon": pieza.color === "blanco" ? "♙" : "♟",
            "Torre": pieza.color === "blanco" ? "♖" : "♜",
            "Caballo": pieza.color === "blanco" ? "♘" : "♞",
            "Alfil": pieza.color === "blanco" ? "♗" : "♝",
            "Reina": pieza.color === "blanco" ? "♕" : "♛",
            "Rey": pieza.color === "blanco" ? "♔" : "♚"
        };
        return iconos[pieza.constructor.name] || "?";
    }
}