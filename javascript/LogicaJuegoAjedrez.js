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
        if (!pieza.puedeMover(origen, destino, this.tablero, this)) return false;
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

    // 1. LÓGICA ESPECIAL PARA EL ENROQUE
    if (pieza.constructor.name === "Rey" && Math.abs(destino.columna - origen.columna) === 2) {
        const fila = origen.fila;
        const esLargo = (destino.columna === 2);
        const origenTorreCol = esLargo ? 0 : 7;
        const destinoTorreCol = esLargo ? 3 : 5;

        const torre = this.tablero[fila][origenTorreCol];
        if (torre) {
            // Movemos la torre a su nueva posición
            this.tablero[fila][destinoTorreCol] = torre;
            // Quitamos la torre de su esquina original
            this.tablero[fila][origenTorreCol] = null;
            // Avisamos a la torre que ya se movió (para que no pueda enrocar de nuevo)
            if (typeof torre.registrarMovimiento === "function") {
                torre.registrarMovimiento();
            }
        }
    }

    // 2. MOVIMIENTO FÍSICO (Aplica para el Rey y para cualquier otra pieza)
    this.tablero[destino.fila][destino.columna] = pieza; // El Rey llega a su destino
    this.tablero[origen.fila][origen.columna] = null;   // El lugar donde estaba el Rey queda vacío

    // 3. PROMOCIÓN AUTOMÁTICA (Solo para peones)
    if (pieza.constructor.name === "Peon" && (destino.fila === 0 || destino.fila === 7)) {
        this.tablero[destino.fila][destino.columna] = new Reina(pieza.color);
    }

    // 4. REGISTRAR MOVIMIENTO (Actualiza el estado 'haMovido' de la pieza)
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

    // Si no encontramos ningún movimiento que salve al Rey, es Jaque Mate
    return true; 

}

validarCondicionesEnroque(origen, destino, tablero) {
    console.log("Validando enroque...");
    const pieza = tablero[origen.fila][origen.columna]; // El Rey
    const fila = origen.fila;
    const esLargo = (destino.columna === 2);
    const colTorre = esLargo ? 0 : 7;
    const torre = tablero[fila][colTorre];

    // 1. ¿Existe la torre y no se ha movido?
    // OJO: Asegúrate que en Torre.js la propiedad sea 'haMovido' (para que coincida con tu registrarMovimiento)
    if (!torre || torre.constructor.name !== "Torre" || torre.haMovido) return false;

    // 2. ¿Camino despejado?
    const columnasPaso = esLargo ? [1, 2, 3] : [5, 6];
    for (let c of columnasPaso) {
        if (tablero[fila][c] !== null) return false;
    }

    // 3. ¿Seguridad del Rey?
    const colorEnemigo = (pieza.color === "blanco") ? "negro" : "blanco";
    // El Rey no puede estar en jaque, ni pasar por una casilla atacada, ni terminar en una
    const casillasAComprobar = esLargo ? [4, 3, 2] : [4, 5, 6]; 
    
    for (let c of casillasAComprobar) {
        if (this.estaBajoAtaque({ fila, columna: c }, colorEnemigo, tablero)) {
            return false;
        }
    }

    return true;
}


generarFEN() {
    let fen = "";
    for (let f = 0; f < 8; f++) {
        let vacias = 0;
        for (let c = 0; c < 8; c++) {
            const pieza = this.tablero[f][c];
            if (!pieza) {
                vacias++;
            } else {
                if (vacias > 0) {
                    fen += vacias;
                    vacias = 0;
                }
                // Diccionario de letras según el tipo de pieza
                const letras = {
                    "Peon": "p", "Torre": "r", "Caballo": "n", 
                    "Alfil": "b", "Reina": "q", "Rey": "k"
                };
                let letra = letras[pieza.constructor.name];
                fen += (pieza.color === "blanco") ? letra.toUpperCase() : letra;
            }
        }
        if (vacias > 0) fen += vacias;
        if (f < 7) fen += "/";
    }

    // Añadimos el turno y otros datos básicos (simplificado)
    const turno = (this.turnoActual === "blanco") ? " w " : " b ";
    return fen + turno + "KQkq - 0 1";
}



}
