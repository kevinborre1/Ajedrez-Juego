// Esperamos a que el HTML cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Instanciamos la lógica (el cerebro)
    const logica = new LogicaJuegoAjedrez();
    
    // 2. Instanciamos el tablero (la cara visible) y le pasamos la lógica
    const interfaz = new Tablero(logica);
    
    // 3. Dibujamos el tablero inicial
    interfaz.mostrarTablero();

});