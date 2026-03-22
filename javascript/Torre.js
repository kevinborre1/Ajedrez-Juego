class Torre extends Pieza {
    constructor(color) {
        super(color);
        this.tipo = "torre";
        this.haMovido = false; // Útil para el futuro enroque
    }

    puedeMover(origen, destino, tablero) {
        // 1. Validar geometría: O la fila es igual, o la columna es igual
        const mismaFila = origen.fila === destino.fila;
        const mismaColumna = origen.columna === destino.columna;

        // Si intenta mover en diagonal o no se mueve, es falso
        if ((!mismaFila && !mismaColumna) || (mismaFila && mismaColumna)) {
            return false;
        }

        // 2. Usar la función de la clase padre
        if (!this.caminoLibre(origen, destino, tablero)) {
            return false;
        }

        // 3. Validar destino (no capturar pieza propia)
        const piezaDestino = tablero[destino.fila][destino.columna];
        return !(piezaDestino && piezaDestino.color === this.color);
    }
    
    registrarMovimiento() {
        this.haMovido = true;
    }
}