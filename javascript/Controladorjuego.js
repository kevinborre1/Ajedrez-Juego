class Controladorjuego {
    constructor(logica, interfazTablero) {
        this.logica = logica;
        this.interfazTablero = interfazTablero;
        this.origenSeleccionado = null;

        // 1. Inicializamos Stockfish (el "cerebro" de la PC)
        // Antes tenías la URL de cdnjs, ahora usás la ruta local
        this.motorIA = new Worker('javascript/stockfish.js');        
        // 2. Configuramos qué pasa cuando la IA nos responde
        this.motorIA.onmessage = (event) => {
            if (event.data.startsWith('bestmove')) {
                const moveStr = event.data.split(' ')[1]; // Ejemplo: "e7e5"
                this.aplicarMovimientoIA(moveStr);
            }
        };
    }

    procesarClic(f, c) {
        // Bloqueo de seguridad: si es turno de las negras, el humano no puede cliquear
        if (this.logica.turnoActual === "negro") return;

        const piezaEnClic = this.logica.tablero[f][c];

        if (!this.origenSeleccionado) {
            // PRIMER CLIC: Seleccionar pieza propia
            if (piezaEnClic && piezaEnClic.color === this.logica.turnoActual) {
                this.origenSeleccionado = { fila: f, columna: c };
            }
        } else {
            // SEGUNDO CLIC: Intentar mover
            const origen = this.origenSeleccionado;
            const destino = { fila: f, columna: c };

            const exito = this.logica.intentarMover(origen, destino);
            
            if (exito) {
                // EL HUMANO MOVIÓ CON ÉXITO
                this.origenSeleccionado = null;
                this.interfazTablero.mostrarTablero(); // Redibujamos tu movimiento

                // --- AQUÍ VA LA LÓGICA DE LA COMPUTADORA ---
                console.log("Esperando respuesta de la IA...");
                setTimeout(() => {
                    this.pedirMovimientoIA();
                }, 500); // 500ms de pausa para que no sea instantáneo
            } else {
                // Si el movimiento falló (ilegal), deseleccionamos o cambiamos selección
                this.origenSeleccionado = (piezaEnClic && piezaEnClic.color === this.logica.turnoActual) 
                    ? { fila: f, columna: c } 
                    : null;
            }
        }

        this.interfazTablero.mostrarTablero(this.origenSeleccionado);
    }

    pedirMovimientoIA() {
        // Obtenemos el estado actual en formato FEN (usando el método que agregaste a Lógica)
        const fen = this.logica.generarFEN();
        
        // Le mandamos los comandos a Stockfish
        this.motorIA.postMessage(`position fen ${fen}`);
        this.motorIA.postMessage('go depth 10'); // Profundidad 10 para que juegue rápido y bien
    }

    aplicarMovimientoIA(moveStr) {
        // Traducimos el string de la IA (ej: "g8f6") a coordenadas de tu matriz
        const colMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
        
        const origen = {
            columna: colMap[moveStr[0]],
            fila: 8 - parseInt(moveStr[1])
        };
        const destino = {
            columna: colMap[moveStr[2]],
            fila: 8 - parseInt(moveStr[3])
        };

        // Ejecutamos el movimiento en tu lógica
        const exito = this.logica.intentarMover(origen, destino);
        
        if (exito) {
            // Redibujamos el tablero para ver el movimiento de la PC
            this.interfazTablero.mostrarTablero();
            console.log("La IA ha movido: " + moveStr);
        }
    }
}