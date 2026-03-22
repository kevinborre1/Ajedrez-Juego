class Peon extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "peon";
    }

    puedeMover(origen, destino, tablero) {
        const diffFila = destino.fila - origen.fila;
        const diffColumna = Math.abs(destino.columna - origen.columna);
        
        // Determinar la dirección según el color (Blanco sube: -1, Negro baja: +1)
        const direccion = this.color === "blanco" ? -1 : 1;
        const filaInicial = this.color === "blanco" ? 6 : 1;

        const piezaDestino = tablero[destino.fila][destino.columna];

        // --- 1. MOVIMIENTO HACIA ADELANTE (Sin captura) ---
        if (diffColumna === 0) {
            // Avance simple (1 casilla)
            if (diffFila === direccion && piezaDestino === null) {
                return true;
            }
            // Avance doble (solo desde posición inicial)
            if (!this.movio && diffFila === 2 * direccion && piezaDestino === null) {
                // Verificar que la casilla intermedia también esté libre
                const filaIntermedia = origen.fila + direccion;
                if (tablero[filaIntermedia][origen.columna] === null) {
                    return true;
                }
            }
        }

        // --- 2. CAPTURA DIAGONAL ---
        if (diffColumna === 1 && diffFila === direccion) {
            // Captura normal: hay una pieza enemiga en el destino
            if (piezaDestino !== null && !this.esMismoColor(piezaDestino)) {
                return true;
            }
            
            // Aquí iría la lógica opcional de "Captura al paso" (En Passant)
        }

        return false;
    }
}