function validarReemplazoReserva(req, res, next) {
    const datos = req.body;
    const permitidos = [
        "estudiante",
        "email",
        "sala",
        "fecha",
        "turno",
        "personas",
        "estado",
    ];
    for (const campo of Object.keys(datos)) {
        if (!permitidos.includes(campo)) {
            return res
                .status(400)
                .json({ error: "El campo " + campo + " no se puede modificar." });
        }
    }

    if (datos.estado !== undefined) {
        const estadosValidos = ["Pendiente", "Confirmada"]; 

        if (!estadosValidos.includes(datos.estado)) {
            return res.status(400).json({
                error: "El campo Estado debe ser 'Pendiente' o 'Confirmada'."
            });
        }
    }
    req.cambiosValidos = { ...req.reservaValidada };
    req.cambiosValidos.estado = datos.estado;
    next();
}

function validarActualizacionReserva(req, res, next) {
    const datos = req.body;
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return res.status(400).json({ error: "Enviá un objeto JSON." });
    }
    for (const campo of Object.keys(datos)) {
        if (campo !== "personas" && campo !== "estado") {
            return res
                .status(400)
                .json({ error: "Solo se puede cambiar Cant. de Personas o Estado." });
        }
    }
    if (datos.personas === undefined && datos.estado === undefined) {
        return res.status(400).json({ error: "Enviá personas o estado." });
    }
    const cambios = {};
    if (datos.personas !== undefined) {
        if (typeof datos.personas !== "number") {
            return res
                .status(400)
                .json({ error: "Personas debe ser un número JSON, sin comillas." });
        }
        if (!Number.isFinite(datos.personas) || datos.personas < 1 || datos.personas > 6) {
            return res
                .status(400)
                .json({ error: "Personas debe ser mayor o igual a 1 y Menor que 7." });
        }
        cambios.personas = datos.personas;
    }

    if (datos.estado !== undefined) {
        const estadosValidos = ["Pendiente", "Confirmada"];
        
        if (!estadosValidos.includes(datos.estado)) {
            return res
                .status(400)
                .json({ error: "El campo Estado debe ser 'Pendiente' o 'Confirmada'." });
        }
        cambios.estado = datos.estado;
    }
        
    req.cambiosValidos = cambios;
    next();
}
module.exports = { validarReemplazoReserva, validarActualizacionReserva };

