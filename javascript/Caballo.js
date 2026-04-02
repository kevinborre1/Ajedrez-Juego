class Caballo extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "caballo";
    }

    puedeMover(origen, destino, tablero) {
        const diffFila = Math.abs(destino.fila - origen.fila);
        const diffColumna = Math.abs(destino.columna - origen.columna);

        const esMovimientoEnL = (diffFila === 2 && diffColumna === 1) || 
                                (diffFila === 1 && diffColumna === 2);

        if (!esMovimientoEnL) return false;

        const piezaDestino = tablero[destino.fila][destino.columna];
        
        if (piezaDestino && piezaDestino.color === this.color) {
            return false;
        }

        return true;
    }
}