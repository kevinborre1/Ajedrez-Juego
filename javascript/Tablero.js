class Tablero {
    constructor(logica) {
        this.logica = logica; // Referencia a tu clase LogicaJuegoAjedrez
        this.contenedor = document.getElementById("tablero");
        this.origenSeleccionado = null; // Guarda {fila, columna} del primer clic
    }

    mostrarTablero() {
        this.contenedor.innerHTML = "";

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const pieza = this.logica.tablero[i][j];
                const celda = document.createElement("div");
                celda.classList.add("celda");
                
                // Aplicar color de la casilla (clara u oscura)
                const esClara = (i + j) % 2 === 0;
                celda.style.backgroundColor = esClara ? "#eee" : "#555";

                // Si hay una pieza en esta posición de la matriz
                if (pieza) {
                    celda.textContent = this.obtenerIconoPieza(pieza);
                    celda.classList.add(pieza.color); // Útil para CSS (blanco/negro)
                }

                // Resaltar si esta casilla es la que acabamos de seleccionar
                if (this.origenSeleccionado && 
                    this.origenSeleccionado.fila === i && 
                    this.origenSeleccionado.columna === j) {
                    celda.style.outline = "4px solid yellow";
                    celda.style.zIndex = "10";
                }

                // EVENTO PRINCIPAL
                celda.onclick = () => this.manejarClic(i, j);

                this.contenedor.appendChild(celda);
            }
        }
    }

    manejarClic(f, c) {
        const piezaEnClic = this.logica.tablero[f][c];

        // CASO A: No hay nada seleccionado aún
        if (!this.origenSeleccionado) {
            // Solo seleccionamos si el clic es en una pieza del turno actual
            if (piezaEnClic && piezaEnClic.color === this.logica.turnoActual) {
                this.origenSeleccionado = { fila: f, columna: c };
                this.mostrarTablero(); // Refrescamos para mostrar el resalte amarillo
            }
        } 
        // CASO B: Ya teníamos una pieza seleccionada e hicimos el segundo clic
        else {
            const origen = this.origenSeleccionado;
            const destino = { fila: f, columna: c };

            // Intentamos mover usando la lógica que armamos antes
            const exito = this.logica.intentarMover(origen, destino);

            if (exito) {
                console.log("Movimiento realizado con éxito");
            } else {
                console.warn("Movimiento ilegal intentado");
            }

            // Limpiamos la selección y redibujamos
            this.origenSeleccionado = null;
            this.mostrarTablero();
        }
    }

    obtenerIconoPieza(pieza) {
        const nombrePieza = pieza.constructor.name;
        const iconos = {
            "Peon": pieza.color === "blanco" ? "♙" : "♟",
            "Torre": pieza.color === "blanco" ? "♖" : "♜",
            "Caballo": pieza.color === "blanco" ? "♘" : "♞",
            "Alfil": pieza.color === "blanco" ? "♗" : "♝",
            "Reina": pieza.color === "blanco" ? "♕" : "♛",
            "Rey": pieza.color === "blanco" ? "♔" : "♚"
        };
        return iconos[nombrePieza] || "?";
    }
}