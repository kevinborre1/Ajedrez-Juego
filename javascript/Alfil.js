class Alfil extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "alfil";
    }

    puedeMover(origen, destino, tablero) {
        const difFila = Math.abs(destino.fila - origen.fila);
        const difCol = Math.abs(destino.columna - origen.columna);

        // Geometría de diagonal
        if (difFila !== difCol || difFila === 0) return false;

        // Camino libre (padre)
        if (!this.caminoLibre(origen, destino, tablero)) return false;

        const piezaDestino = tablero[destino.fila][destino.columna];
        return !(piezaDestino && piezaDestino.color === this.color);
    }
}