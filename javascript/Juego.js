// 1. Crear el cerebro
const logica = new LogicaJuegoAjedrez();

// 2. Crear la vista (Tablero)
const interfaz = new Tablero(logica);

// 3. Crear el controlador (Pasando AMBOS: logica e interfaz)
// El error en la línea 8 suele ser porque falta uno de estos dos
const controlador = new ControladorJuego(logica, interfaz);

// 4. Conectar el tablero con el controlador para los clics
interfaz.setControlador(controlador);

// 5. Mostrar por primera vez
interfaz.mostrarTablero();