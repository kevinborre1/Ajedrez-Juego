class ControladorJuego {
    constructor(logica, interfazTablero) {
        this.logica = logica;
        this.interfazTablero = interfazTablero;
        this.origenSeleccionado = null;
    }

    // El cerebro de la interacción
    procesarClic(f, c) {
        const piezaEnClic = this.logica.tablero[f][c];

        if (!this.origenSeleccionado) {
            // Primer clic: Selección
            if (piezaEnClic && piezaEnClic.color === this.logica.turnoActual) {
                this.origenSeleccionado = { fila: f, columna: c };
            }
        } else {
            // Segundo clic: Intento de movimiento
            const origen = this.origenSeleccionado;
            const destino = { fila: f, columna: c };

            const exito = this.logica.intentarMover(origen, destino);
            
            if (exito) console.log("Movimiento exitoso");
            
            this.origenSeleccionado = null;
        }

        // Siempre mandamos a redibujar después de un clic relevante
        this.interfazTablero.mostrarTablero(this.origenSeleccionado);
    }
}