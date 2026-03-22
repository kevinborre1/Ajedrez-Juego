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
        
        //si el peon llega al final del tablero, se promociona a reina automáticamente
        if (pieza.tipo === "Peon" && (destino.fila === 0 || destino.fila === 7)) {
            this.tablero[destino.fila][destino.columna] = new Reina(pieza.color);
        }
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
    const colorPropio = this.turnoActual;
    const colorOponente = (colorPropio === "blanco") ? "negro" : "blanco";

    // 1. Clonamos el tablero (solo las referencias de la matriz)
    // Usamos map y spread para no modificar el array 'this.tablero' original
    const tableroSimulado = this.tablero.map(fila => [...fila]);

    // 2. Simulamos el movimiento en la copia
    const piezaAMover = tableroSimulado[origen.fila][origen.columna];
    tableroSimulado[destino.fila][destino.columna] = piezaAMover;
    tableroSimulado[origen.fila][origen.columna] = null;

    // 3. Localizamos dónde quedó el Rey del color actual
    const posRey = this.encontrarPosicionRey(colorPropio, tableroSimulado);

    // Si por alguna razón no hay Rey (error de inicialización), no es suicida
    if (!posRey) return false;

    // 4. Verificamos si alguna pieza enemiga puede atacar esa casilla
    return this.estaBajoAtaque(posRey, colorOponente, tableroSimulado);
}

// Método para encontrar las coordenadas del objeto Rey
encontrarPosicionRey(color, tablero) {
    for (let f = 0; f < 8; f++) {
        for (let c = 0; c < 8; c++) {
            const pieza = tablero[f][c];
            // Verificamos que sea un objeto, del mismo color y tipo Rey
            if (pieza && pieza.color === color && pieza.constructor.name === "Rey") {
                return { fila: f, columna: c };
            }
        }
    }
    return null;
}

// Método clave: Revisa si el enemigo llega a una coordenada
estaBajoAtaque(posicion, colorEnemigo, tablero) {
    for (let f = 0; f < 8; f++) {
        for (let c = 0; c < 8; c++) {
            const pieza = tablero[f][c];
            if (pieza && pieza.color === colorEnemigo) {
                // Importante: le pasamos el 'tablero' de la simulación
                if (pieza.puedeMover({ fila: f, columna: c }, posicion, tablero)) {
                    return true;
                }
            }
        }
    }
    return false;
}

   crearTableroInicial() {
    // 1. Creamos la matriz vacía de 8x8
    let matriz = Array(8).fill(null).map(() => Array(8).fill(null));

    // 2. Definimos el orden de las piezas mayores
    const piezasMayores = [
        Torre, Caballo, Alfil, Reina, Rey, Alfil, Caballo, Torre
    ];

    // 3. Llenamos las filas 0, 1 (Negras) y 6, 7 (Blancas)
    for (let i = 0; i < 8; i++) {
        // --- PIEZAS NEGRAS ---
        matriz[0][i] = new piezasMayores[i]("negro");
        matriz[1][i] = new Peon("negro");

        // --- PIEZAS BLANCAS ---
        matriz[6][i] = new Peon("blanco");
        matriz[7][i] = new piezasMayores[i]("blanco");
    }

    return matriz;
}
}