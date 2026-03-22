class Rey extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "rey";
        this.haMovido = false; // Importante para el futuro Enroque
    }

    puedeMover(origen, destino, tablero) {
        const difFila = Math.abs(destino.fila - origen.fila);
        const difCol = Math.abs(destino.columna - origen.columna);

        // 1. Validar geometría: Solo puede moverse 1 casilla en cualquier dirección
        // (Máximo 1 en fila Y máximo 1 en columna, pero no 0 en ambos)
        const esMovimientoUnico = (difFila <= 1 && difCol <= 1) && !(difFila === 0 && difCol === 0);
        
        if (!esMovimientoUnico) {
            // Aquí podrías añadir la lógica del Enroque más adelante (difCol === 2)
            return false;
        }

        // 2. Validar destino (no capturar pieza propia)
        const piezaDestino = tablero[destino.fila][destino.columna];
        if (piezaDestino && piezaDestino.color === this.color) {
            return false;
        }

        return true;
    }

    registrarMovimiento() {
        this.haMovido = true;
    }
}