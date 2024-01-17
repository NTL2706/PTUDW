import { Server } from 'socket.io';
import { createServer } from 'http';

let io;

function initializeSocket(app) {
    const httpServer = createServer(app);
    io = new Server(httpServer, { cors: { origin: '*' } });

    httpServer.listen(3000, () => {
        console.log("Socket start")
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }
    return io;
}

export { initializeSocket, getIO };
