class Peon extends Pieza {
    constructor(color) {
        super(color); 
    }

    

    puedeMover(origen, destino, tablero) {
        const direccion = this.color === "blanco" ? -1 : 1;
        const piezaDestino = tablero[destino.fila][destino.columna];

        // 1. AVANCE SIMPLE (1 casilla)
        if (origen.columna === destino.columna &&
            destino.fila === origen.fila + direccion &&
            piezaDestino === null) {
            return true;
        }

        // 2. AVANCE DOBLE (Solo si no se ha movido antes)
        if (origen.columna === destino.columna &&
            !this.movio && // Usando la propiedad heredada
            destino.fila === origen.fila + 2 * direccion &&
            piezaDestino === null) {
            
            // Verificar que la casilla intermedia esté vacía
            const filaIntermedia = origen.fila + direccion;
            if (tablero[filaIntermedia][origen.columna] === null) {
                return true;
            }
        }

        // 3. CAPTURA DIAGONAL
        if (Math.abs(destino.columna - origen.columna) === 1 &&
            destino.fila === origen.fila + direccion &&
            piezaDestino !== null &&
            !this.esMismoColor(piezaDestino)) {
            return true;
        }

        return false;
    }
}