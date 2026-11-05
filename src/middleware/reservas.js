function prepararAreaReservas(req, res, next) {
    res.locals.seccion = "Reserva Salas";
    next();
}
function validarDatosReserva(req, res, next) {
    const valores = req.body ?? {};
    const estudiante = typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
    const email = typeof valores.email === "string" ? valores.email.trim() : "";
    const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";
    const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";
    const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";
    const tipovalido = typeof valores.personas === "number" || (typeof valores.personas === "string" && valores.personas.trim() !=="");
    const personas = tipovalido ?  Number(valores.personas) : NaN;
    const estado = typeof valores.estado === "string" ? valores.estado.trim() : "";
    
    const salasDisponibles = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
    const turnosDisponibles = ["Mañana", "Tarde", "Noche"];
    const estadosDisponibles = ["Pendiente","Confirmada"];

    const valoresLimpios = { estudiante, email, fecha, turno, sala, personas, estado };

    if (
        !estudiante ||
        !email ||
        !fecha ||
        !turnosDisponibles.includes(turno) ||
        !salasDisponibles.includes(sala) ||
        !Number.isInteger(personas) ||
        personas < 1 ||
        personas > 6 ||
        !estadosDisponibles.includes(estado)         
    ) {
        if (req.baseUrl === "/api/reservas") {
            return res
            .status(400)
            .json({error: "Revisa los Datos de la Reserva",});
        }
        return res.status(400).render("reservas/nueva", {
            titulo: "Nueva Reserva",
            error: "Revisa los Datos de la Reserva",
            valores: valoresLimpios
        });
    }

    if (!email.includes("@")) {
        if (req.baseUrl === "/api/reservas") {
            return res.status(400).json({
                error: "Email inválido"
            });
        }
        return res.status(400).render("reservas/nueva", {
            titulo: "Nueva Reserva",
            error: "El correo electrónico debe contener el carácter '@'.",
            valores: valoresLimpios
        });
    }

    req.reservaValidada = valoresLimpios;

    next();
}
module.exports = { prepararAreaReservas, validarDatosReserva };
