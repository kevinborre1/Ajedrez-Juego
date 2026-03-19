class LogicaJuegoAjedrez {
    constructor() {
        this.tablero = this.crearTableroInicial();
        this.turnoActual = "blanco";
        this.historialMovimientos = [];
    }

    // Método principal que llamaamos desde la interfaz para intentar mover una pieza
    intentarMover(origen, destino) {
        const pieza = this.tablero[origen.fila][origen.columna];

        
        if (!pieza || pieza.color !== this.turnoActual) {
            console.warn("No es tu pieza o no hay pieza en el origen.");
            return false;
        }

        
        if (!pieza.puedeMover(origen, destino, this.tablero)) {
            console.warn("Movimiento inválido para esta pieza.");
            return false;
        }

        // 3. ¿El movimiento deja al propio Rey en jaque? (Regla de oro)
        if (this.movimientoEsSuicida(origen, destino)) {
            console.warn("Movimiento ilegal: deja al Rey en jaque.");
            return false;
        }

        this.ejecutarMovimiento(origen, destino);
        
        this.cambiarTurno();
        
        return true; 
    }

    ejecutarMovimiento(origen, destino) {
        const pieza = this.tablero[origen.fila][origen.columna];

        // Mover la pieza en la matriz
        this.tablero[destino.fila][destino.columna] = pieza;
        this.tablero[origen.fila][origen.columna] = null;

        // Si la pieza tiene lógica interna de "primer movimiento" (útil para Peón/Torre)
        if (typeof pieza.registrarMovimiento === "function") {
            pieza.registrarMovimiento();
        }

        console.log(`Movido: ${pieza.constructor.name} a ${destino.fila},${destino.columna}`);
    }

    cambiarTurno() {
        this.turnoActual = (this.turnoActual === "blanco") ? "negro" : "blanco";
        console.log("Turno de las: " + this.turnoActual);
    }

    movimientoEsSuicida(origen, destino) {
        /* Lógica simplificada:
           1. Clonar el tablero actual (una copia temporal).
           2. Ejecutar el movimiento en la copia.
           3. Verificar si el Rey del color actual está amenazado en esa copia.
        */
        return false; // Implementar cuando tengas la lógica de "Jaque"
    }

    crearTableroInicial() {
        // Aquí inicializas tu matriz de 8x8 con nulls y piezas
        // Ejemplo rápido:
        let matriz = Array(8).fill(null).map(() => Array(8).fill(null));
        // matriz[6][0] = new Peon("blanco"); ... etc
        return matriz;
    }
}