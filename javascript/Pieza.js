class Pieza {
    constructor(color) {
        this.color = color; // "blanco" o "negro"
        this.movio = false; // Estado común para Peones, Torres y Reyes
    }

    // Comprueba si una pieza en el destino es aliada
    esMismoColor(otraPieza) {
        return otraPieza && this.color === otraPieza.color;
    }

    // Este método DEBE ser sobrescrito por las clases hijas (Peon, Torre, etc.)
    puedeMover(origen, destino, tablero) {
        throw new Error("El método 'puedeMover' debe ser implementado por la pieza específica.");
    }

    // Método de utilidad para marcar que la pieza ya se desplazó
    registrarMovimiento() {
        this.movio = true;
    }
    
    caminoLibre(origen, destino, tablero) {
    const pasoFila = destino.fila === origen.fila ? 0 : (destino.fila > origen.fila ? 1 : -1);
    const pasoCol = destino.columna === origen.columna ? 0 : (destino.columna > origen.columna ? 1 : -1);

    let f = origen.fila + pasoFila;
    let c = origen.columna + pasoCol;

    // Recorremos las casillas intermedias (sin incluir el destino)
    while (f !== destino.fila || c !== destino.columna) {
        if (tablero[f][c] !== null) {
            return false; // Hay alguien en medio
        }
        f += pasoFila;
        c += pasoCol;
        }
        return true;
    
    }

}