import express from 'express';
import { createServer } from 'http';
const app = express();
const server = createServer(app);
import { Server } from 'socket.io';

const io = new Server(server);
const args = process.argv.slice(2);
const port_arg = args.find(arg => {
    console.log(arg.split('=')[0]);
    return arg.split('=')[0]==='port';
});
const port = port_arg && port_arg.split('=')[1] || '4000';
let unusedport = port;
console.log(port);

/** init websocket stuff */
io.on('connection', (socket) => {
    console.log('websocket client connected');
    socket.send('hi');
    socket.on('message', async(data) => {
        console.log('message', data);
    })
});

app.use('/webhook', async(req,res,next) => {
    console.log('received something', req);
    const walletId = req.headers['x-wallet-id'];
    const data = JSON.parse(req.body);
    console.log('wallet: ', walletId, 'data:', data);
    next();
});
app.use(express.static('front/build'));

server.listen(port, () => {
    console.log(`webhook proxy listening on port ${port}.`);
});

interface ADDRINUSEERROR{
    code: string,
}

server.on('error', (e:ADDRINUSEERROR) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        unusedport = (Number.parseInt(unusedport) +1).toString();
        setTimeout(() => {
            server.close();
            server.listen(unusedport, () => {
                console.log(`virta controller listening on port ${unusedport}.`);
            });
        }, 1000);
    }
});