class Reina extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "reina";
    }

    puedeMover(origen, destino, tablero) {
        const difFila = Math.abs(destino.fila - origen.fila);
        const difCol = Math.abs(destino.columna - origen.columna);

        // 1. Validar geometría: ¿Es un movimiento de Torre O de Alfil?
        const esMovimientoTorre = (origen.fila === destino.fila || origen.columna === destino.columna);
        const esMovimientoAlfil = (difFila === difCol);

        // Si no es ninguno de los dos, o si el destino es la misma casilla
        if (!(esMovimientoTorre || esMovimientoAlfil) || (difFila === 0 && difCol === 0)) {
            return false;
        }

        // 2. Usar la función de la clase padre para ver si hay obstáculos
        if (!this.caminoLibre(origen, destino, tablero)) {
            return false;
        }

        // 3. Validar destino (no capturar pieza propia)
        const piezaDestino = tablero[destino.fila][destino.columna];
        return !(piezaDestino && piezaDestino.color === this.color);
    }
}