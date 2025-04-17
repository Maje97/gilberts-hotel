import { Server } from "socket.io";

export const userSocketMap: Record<number, string> = {};

export const setupSocket = (io: Server) => {
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
  
      socket.on("register", ({ userId }: { userId: number }) => {
        if (userId) {
          userSocketMap[userId] = socket.id;
          console.log(`Registered user ${userId} with socket ${socket.id}`);
        }
      });
  
      socket.on("disconnect", () => {
        for (const [userId, sockId] of Object.entries(userSocketMap)) {
          if (sockId === socket.id) {
            delete userSocketMap[Number(userId)];
            break;
          }
        }
      });
    });
};