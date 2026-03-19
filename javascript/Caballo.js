class Caballo extends Pieza {
    constructor(color) {
        super(color);
    }

    puedeMover(origen, destino, tablero) {
        const diffFila = Math.abs(destino.fila - origen.fila);
        const diffColumna = Math.abs(destino.columna - origen.columna);

        // La "L" del caballo: (2 en uno y 1 en otro)
        const esMovimientoEnL = (diffFila === 2 && diffColumna === 1) || 
                                (diffFila === 1 && diffColumna === 2);

        if (esMovimientoEnL) {
            const piezaDestino = tablero[destino.fila][destino.columna];

            // Puede mover si el destino está vacío 
            // O si hay una pieza del color OPUESTO (captura)
            if (piezaDestino === null || !this.esMismoColor(piezaDestino)) {
                return true;
            }
        }

        return false;
    }
}