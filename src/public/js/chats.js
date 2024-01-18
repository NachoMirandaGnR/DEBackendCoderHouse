// Configuración del socket con el token
const socket = io({
  auth: {
    token: "el-token-aqui", // Reemplaza con el token real
  },
});

// Enviar mensajes anteriores al usuario que se conecta
socket.on("connect", () => {
  socket.emit("chat history");
});

$("form").submit(function () {
  socket.emit("chat message", $("#m").val());
  $("#m").val("");
  return false;
});
