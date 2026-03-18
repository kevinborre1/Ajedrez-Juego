class Peon extends Pieza {
    constructor(color) {
        super(color);
    }

    puedeMover(origen, destino, tablero) {

        let direccion = this.color === "blanco" ? -1 : 1;

        let piezaDestino = tablero[destino.fila][destino.columna];

        //avanza 1 
        if (origen.columna === destino.columna &&
            destino.fila === origen.fila + direccion &&
            piezaDestino === null) {
            return true;
        }

        // avanzar 2 (primer movimiento)
        if (origen.columna === destino.columna &&
            ((this.color === "blanco" && origen.fila === 6) ||
             (this.color === "negro" && origen.fila === 1)) &&
            destino.fila === origen.fila + 2 * direccion &&
            piezaDestino === null) {
            return true;
        }

        // comer en diagonal
        if (Math.abs(destino.columna - origen.columna) === 1 &&
            destino.fila === origen.fila + direccion &&
            piezaDestino !== null &&
            !this.esMismoColor(piezaDestino)) {
            return true;
        }

        return false;
    }
}