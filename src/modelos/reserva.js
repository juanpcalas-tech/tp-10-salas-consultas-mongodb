const mongoose = require("mongoose");
const reservasSchema = new mongoose.Schema(
    {
        estudiante: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no tiene un formato válido"] },
        sala: { type: String, required: true, enum: ["Sala Norte","Sala Sur","Sala Multimedia"], },
        fecha: { type: String, required: true, trim: true },
        turno: { type: String, required: true, enum: ["Mañana","Tarde","Noche"],},        
        personas: { type: Number, required: true, min: 1, max:6, validate: { validator: Number.isInteger, message: "Debe ser Entero"}, },
        estado: { type: String, enum: ["Pendiente","Confirmada"], default: "Pendiente", } 
    },    
    { collection: "reservas" },
);
const Reserva = mongoose.model("Reserva", reservasSchema);
module.exports = { Reserva };

