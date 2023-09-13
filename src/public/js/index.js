import { io } from "socket.io-client";

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
});

socket.on("productUpdate", (data) => {
  console.log("Actualización de producto recibida:", data);
});

socket.on("notification", (message) => {
  console.log("Notificación recibida:", message);
});
