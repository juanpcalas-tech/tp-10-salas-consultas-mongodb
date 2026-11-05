function crearControladorReservas(servicio) {
    async function listar(req, res) {
        const reservas = await servicio.listar();
        res.render("reservas/lista", {
            titulo: "Reserva Salas",
            reservas,
        });
    }
    function mostrarFormulario(req, res) {
        res.render("reservas/nueva", {
            titulo: "Nueva reserva",
            error: null,
            valores: {},
        });
    }
    async function mostrarDetalle(req, res) {
        const reserva = await servicio.obtenerPorId(req.params.id);
        if (!reserva) {
            return res.status(404).render("no-encontrado", {
                titulo: "Reserva no encontrada",
                mensaje: "No existe una reserva con ese identificador.",
            });
        }
        res.render("reservas/detalle", { titulo: reserva.estudiante, fecha, sala });
    }
    async function crear(req, res) {
        await servicio.crear(req.reservaValidada);
        res.redirect("/reservas");
    }

    async function estado(req, res) {
        const cantidad = await servicio.contar();
        res.status(200).json({
            servicio: "Activo",
            reservas: cantidad,
            idSolicitud: res.locals.idSolicitud,
        });
    }

    async function listarApi(req, res) {
        const permitidos = ["sala", "orden", "pagina", "limite"];
        for (const campo of Object.keys(req.query)) {
            if (!permitidos.includes(campo)) {
                return res.status(400).json({ error: "Parámetro no permitido." });
            }
        }
        const sala = req.query.sala;
        if (sala !== undefined) {
            if (typeof sala !== "string" || sala.trim() === "") {
                return res
                    .status(400)
                    .json({ error: "El texto de sala debe tener contenido." });
            }
        }

        let orden = "estudiante";
        if (req.query.orden !== undefined) {
            orden = req.query.orden;
            if (
                orden !== "estudiante" &&
                orden !== "personas-asc" &&
                orden !== "personas-desc"
            ) {
                return res.status(400).json({ error: "Orden no permitido." });
            }
        }

        let pagina = 1
        if (req.query.pagina !== undefined) {
            if (typeof req.query.pagina !== "string") {
                return res
                    .status(400)
                    .json({ error: "Envia un valor de Página" });
            }
            pagina = Number(req.query.pagina)
            if (!Number.isInteger(pagina) || pagina < 1 || pagina > 1000) {
                return res
                    .status(400)
                    .json({ error: "Página fuera del Rango permitido" });
            }
        }

        let limite = 2
        if (req.query.limite !== undefined) {
            if (typeof req.query.limite !== "string") {
                return res
                    .status(400)
                    .json({ error: "Envia un solo valor de límite" });
            }
            limite = Number(req.query.limite)
            if (!Number.isInteger(limite) || limite < 1 || limite > 20) {
                return res
                    .status(400)
                    .json({ error: "Límite fuera del Rango permitido" });
            }
        }        

        const resultado = await servicio.consultar(sala, orden, pagina, limite);
        res.json(resultado);
    }

    async function obtenerApi(req, res) {
        const reserva = await servicio.obtenerPorId(req.params.id);
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada." });
        }
        res.json(reserva);
    }
    async function crearApi(req, res) {
        const reserva = await servicio.crear(req.reservaValidada);
        res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
    }
    async function eliminarApi(req, res) {
        const eliminado = await servicio.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Recurso no encontrado." });
        }
        res.status(204).end();
    }

    async function reemplazarApi(req, res) {
        const reserva = await servicio.reemplazar(
            req.params.id,
            req.cambiosValidos,
        );
        if (!reserva) {
            return res.status(404).json({ error: "Recurso no encontrado." });
        }
        res.json(reserva);
    }

    async function actualizarApi(req, res) {
        const reserva = await servicio.actualizar(
            req.params.id,
            req.cambiosValidos,
        );
        if (!reserva) {
            return res.status(404).json({ error: "Recurso no encontrado." });
        }
        res.json(reserva);
    }
    return { listar, mostrarFormulario, mostrarDetalle, crear, estado, listarApi, obtenerApi, crearApi, eliminarApi, reemplazarApi, actualizarApi };


}
module.exports = { crearControladorReservas };


