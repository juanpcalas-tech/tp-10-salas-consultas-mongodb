const {
    conectarBaseDatos,
    desconectarBaseDatos,
} = require("../src/config/base-datos");
const { Reserva } = require("../src/modelos/reserva");
async function main() {
    try {
        await conectarBaseDatos();
        const reservas = await Reserva.find({});
        console.table(
            reservas.map((reserva) => ({
                id: reserva._id.toString(),
                estudiante: reserva.estudiante,
                turno: reserva.turno,
                fecha: reserva.fecha,
                sala: reserva.sala,
                personas: reserva.personas,
                estado: reserva.estado
            })),
        );
        console.log("Total de reservas:", reservas.length);
    } finally {
        await desconectarBaseDatos();
    }
}
main().catch((error) => {
    console.error("No se pudo consultar las reservass:", error.name);
    console.error("Revisar configuración y disponibilidad de MongoDB.");
    process.exitCode = 1;
});