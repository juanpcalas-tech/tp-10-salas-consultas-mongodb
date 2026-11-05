const express = require("express");
const { validarDatosReserva } = require("../middleware/reservas");
const { validarReemplazoReserva, validarActualizacionReserva } = require("../middleware/cambios-reservas");
function crearRouterReservasApi(controlador) {
    const router = express.Router();
    router.get("/", controlador.listarApi);
    router.get("/:id", controlador.obtenerApi);
    router.post("/", validarDatosReserva, controlador.crearApi);
    router.put("/:id", validarDatosReserva, validarReemplazoReserva, controlador.reemplazarApi,);
    router.patch("/:id", validarActualizacionReserva, controlador.actualizarApi);
    router.delete("/:id", controlador.eliminarApi);    
    return router;
}
module.exports = { crearRouterReservasApi };

