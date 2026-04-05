class LogicaJuegoAjedrez {
    constructor() {
        this.tablero = this.crearTableroInicial();
        this.turnoActual = "blanco";
        this.historialMovimientos = [];
    }

    intentarMover(origen, destino) {
        const pieza = this.tablero[origen.fila][origen.columna];

        // 1. Validaciones básicas (turno, geometría, no suicidio)
        if (!pieza || pieza.color !== this.turnoActual) return false;
        if (!pieza.puedeMover(origen, destino, this.tablero)) return false;
        if (this.movimientoEsSuicida(origen, destino)) return false;

        // 2. EJECUTAR EL MOVIMIENTO PRIMERO
        this.ejecutarMovimiento(origen, destino);

        // 3. DEFINIR AL OPONENTE (el que acaba de recibir el movimiento)
        const colorOponente = (this.turnoActual === "blanco") ? "negro" : "blanco";        

        // 5. Cambiar el turno para la siguiente jugada
        this.cambiarTurno();
        
        if (this.estaEnJaqueMate(colorOponente)) {
            console.log("¡JAQUE MATE DETECTADO para " + colorOponente + "!");
            this.cambiarTurno();  
            alert("¡JAQUE MATE! Ganador: " + this.turnoActual);
        }
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

estaEnJaqueMate(color) {
    const colorOponente = (color === "blanco") ? "negro" : "blanco";
    const posRey = this.encontrarPosicionRey(color, this.tablero);

    // 1. Si el Rey no está bajo ataque, no puede ser Jaque Mate
    if (!this.estaBajoAtaque(posRey, colorOponente, this.tablero)) {
        return false;
    }

    // 2. Si está en jaque, buscamos SI EXISTE algún movimiento que lo salve
    // Recorremos todo el tablero buscando piezas del color en peligro
    for (let f = 0; f < 8; f++) {
        for (let c = 0; c < 8; c++) {
            const pieza = this.tablero[f][c];

            if (pieza && pieza.color === color) {
                // Para cada pieza, probamos todos los destinos posibles del tablero
                for (let df = 0; df < 8; df++) {
                    for (let dc = 0; dc < 8; dc++) {
                        const origen = { fila: f, columna: c };
                        const destino = { fila: df, columna: dc };

                        // ¿Es un movimiento físicamente posible para la pieza?
                        if (pieza.puedeMover(origen, destino, this.tablero)) {
                            // ¿Y ese movimiento es legal (no deja al Rey en jaque)?
                            if (!this.movimientoEsSuicida(origen, destino)) {
                                // ¡Encontramos una salida! No es jaque mate
                                console.log("¡JAQUE MATE DETECTADO para " + color + "!");

                                return false; 
                                    
                                

                            }
                        }
                    }
                }
            }
        }
    }

    
    // 3. Si recorrimos todo y ningún movimiento salvó al Rey...
    console.log("¡JAQUE MATE DETECTADO para " + color + "!");
    return true; 

}
}
