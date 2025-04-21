import { io } from "socket.io-client";

const socket = io("https://gilberts-hotel-167477665950.europe-north2.run.app", {
  transports: ['websocket'],
}); // Match backend

let currentUserId: number | null = null;

export const registerSocket = (userId: number) => {
  currentUserId = userId;
  socket.emit("register", { userId });
};

socket.on("connect", () => {
  if (currentUserId !== null) {
    socket.emit("register", { userId: currentUserId });
  }
});

export default socket;