import { Server } from "socket.io";
import { getConnections, updateConnection } from "./api.js";

const socket = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('websocket client connected');
        socket.send('hi');
        socket.send({
            type: 'new',
            data: {
                obj: 'Connection',
                data: {
                    otherParty: 'Kela Kerttu', 
                    newItem: true
                }
            }
        });
        socket.on('message', async(data) => {
            console.log('message', data);
            if(data.type==='seen'){
                await markAsSeen(data, socket);
            }
        })
    });
}

const markAsSeen = async(data, socket) => {
    const existing_mock_data:any = await getConnections();
    console.log('existing data', existing_mock_data);
    const objToUpdate = existing_mock_data.find(o => {
        console.log('o', o.id);
        console.log('data', data.data)
        return o.id === data.data
    });
    objToUpdate.newItem = false;
    console.log('obj to update', objToUpdate);
    updateConnection(objToUpdate);
    socket.send({type: 'update', data: {obj: 'Connection', data: {id: objToUpdate.id, newItem:objToUpdate.newItem}}})
}

export default socket;