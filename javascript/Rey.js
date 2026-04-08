class Rey extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "rey";
        this.haMovido = false; // Importante para el futuro Enroque
    }

    // Dentro de la clase Rey
    puedeMover(origen, destino, tablero, logicaJuego) {
        const difFila = Math.abs(destino.fila - origen.fila);
        const difCol = Math.abs(destino.columna - origen.columna);

        // Movimiento normal del Rey (1 casilla)
        if (difFila <= 1 && difCol <= 1) return true;

        // Lógica de Enroque
        if (difCol === 2 && this.haMovido) {
            return this.validarCondicionesEnroque(origen, destino, tablero);
        }
        return false;
    }

    registrarMovimiento() {
        this.haMovido = true;
    }
}