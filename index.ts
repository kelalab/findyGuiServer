import express from 'express';
import { createServer } from 'http';
const app = express();
const server = createServer(app);
import apiRouter from './api.js';
import { Server } from 'socket.io';
import socket from './websocket.js';
const port = 4000;
const io = new Server(server);

/** init websocket stuff */
socket(io);

app.use('/api', apiRouter);

server.listen(port, () => {
    console.log(`server listening on port ${port}.`);
});