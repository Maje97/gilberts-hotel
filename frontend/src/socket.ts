import { io } from "socket.io-client";

const socket = io("https://gilberts-hotel-167477665950.europe-north2.run.app", {
  transports: ['websocket'],
}); // Match backend

export const registerSocket = (userId: number) => {
  socket.emit("register", { userId });
};

export default socket;