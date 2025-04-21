import { Server } from "socket.io";
import logger from "./logger";

export const userSocketMap: Record<number, string> = {};

export const setupSocket = (io: Server) => {
    io.on("connection", (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on("error", (err) => {
        logger.error(`Socket error from ${socket.id}: ${err}`);
      });
  
      socket.on("register", (data: { userId: number }) => {
        try {
          const { userId } = data;
          if (!userId) {
            logger.warn(`Invalid register payload: ${JSON.stringify(data)}`);
            return;
          } 
          userSocketMap[userId] = socket.id;
          logger.info(`Registered/logged in user ${userId} with socket id ${socket.id}`);
          io.emit('login', `Registered user ${userId} with socket id ${socket.id}`);
        } catch (err) {
          logger.error(`Error in 'register' handler: ${err}`);
        }   
      });
  
      socket.on("disconnect", () => {
        const userId = Object.entries(userSocketMap).find(
          ([, sockId]) => sockId === socket.id
        )?.[0];
      
        if (userId) {
          delete userSocketMap[Number(userId)];
          logger.info(`User ${userId} disconnected (socket id ${socket.id})`);
        } else {
          logger.warn(`Socket ${socket.id} disconnected, but user not found in map`);
        }
      });
    });
};