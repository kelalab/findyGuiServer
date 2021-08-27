import { Server } from "socket.io";

const socket = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('websocket client connected');
        socket.send('hi');
        socket.send({type: 'connection', data: {otherParty: 'Kela', newItem: true}})
    });
}
export default socket;