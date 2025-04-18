import { io } from "socket.io-client";

const socket = io("https://gilberts-hotel-673663b70f08.herokuapp.com"); // Match backend

export const registerSocket = (userId: number) => {
  socket.emit("register", { userId });
};

export default socket;