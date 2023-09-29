const mongoose = require("mongoose");

// Definir el esquema para los mensajes
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Crear un modelo a partir del esquema
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
