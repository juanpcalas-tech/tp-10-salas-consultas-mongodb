
const express = require("express");
const {
  prepararAreaReservas,
  validarDatosReserva,
} = require("../middleware/reservas");

function crearRouterReservas(controladorReservas) {
  const router = express.Router();
  router.use(prepararAreaReservas);
  router.get("/", controladorReservas.listar);
  router.get("/nueva", controladorReservas.mostrarFormulario);
  router.get("/:id", controladorReservas.mostrarDetalle);
  router.post("/", validarDatosReserva, controladorReservas.crear);
  return router;
}
module.exports = { crearRouterReservas };
