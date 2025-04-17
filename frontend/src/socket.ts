import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // Match backend

export const registerSocket = (userId: number) => {
  socket.emit("register", { userId });
};

export default socket;