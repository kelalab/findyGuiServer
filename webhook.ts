import express from 'express';
import { createServer } from 'http';
const app = express();
const server = createServer(app);

const args = process.argv.slice(2);
const port_arg = args.find(arg => {
    console.log(arg.split('=')[0]);
    return arg.split('=')[0]==='port';
});
const port = port_arg && port_arg.split('=')[1] || '4000';
let unusedport = port;
console.log(port);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/webhook', async(req,res,next) => {
    console.log('received something', req);
    const walletId = req.get('x-wallet-id');
    console.log('body', req.body);
    //const data = JSON.parse(req.body);
    console.log('wallet: ', walletId);
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