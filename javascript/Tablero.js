class Tablero {
    constructor(logica) {
        this.logica = logica; // Referencia a LogicaJuegoAjedrez
        this.contenedor = document.getElementById("tablero");
        this.origenSeleccionado = null; // Para guardar el primer clic
    }

    mostrarTablero() {
        this.contenedor.innerHTML = "";

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const pieza = this.logica.tablero[i][j];
                const celda = this.crearCelda(i, j);
                
                this.aplicarColorCasilla(celda, i, j);
                
                // Si hay una pieza, dibujamos su símbolo o nombre
                if (pieza) {
                    celda.textContent = this.obtenerIconoPieza(pieza);
                    celda.classList.add(pieza.color); // Clase 'blanco' o 'negro'
                }

                // Añadimos el evento de clic para mover
                celda.onclick = () => this.manejarClic(i, j);

                this.contenedor.appendChild(celda);
            }
        }
    }

    crearCelda(f, c) {
        let celda = document.createElement("div");
        celda.classList.add("celda");
        // Guardamos las coordenadas en el elemento para facilitar el debug
        celda.dataset.fila = f;
        celda.dataset.columna = c;
        return celda;
    }

    aplicarColorCasilla(celda, fila, columna) {
        const esClara = (fila + columna) % 2 === 0;
        celda.style.backgroundColor = esClara ? "#eee" : "#555"; // Un gris oscuro suele verse mejor que negro puro
    }

    obtenerIconoPieza(pieza) {
        // Diccionario rápido de iconos Unicode (puedes usar imágenes luego)
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

    manejarClic(f, c) {
        if (!this.origenSeleccionado) {
            // PRIMER CLIC: Seleccionar pieza
            const pieza = this.logica.tablero[f][c];
            if (pieza && pieza.color === this.logica.turnoActual) {
                this.origenSeleccionado = { fila: f, columna: c };
                console.log("Origen seleccionado:", f, c);
                // Opcional: añadir clase CSS para resaltar la celda
            }
        } else {
            // SEGUNDO CLIC: Intentar mover
            const destino = { fila: f, columna: c };
            const exito = this.logica.intentarMover(this.origenSeleccionado, destino);
            
            if (exito) {
                this.mostrarTablero(); // Refrescar vista
            }
            
            this.origenSeleccionado = null; // Limpiar selección siempre
        }
    }
}