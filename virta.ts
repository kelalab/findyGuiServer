import express from 'express';
import session from 'express-session';
import process from 'process';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import { createServer } from 'http';
import apiRouter from './src/api.js';
import { Server } from 'socket.io';
import socket from './websocket.js';
import fetch from 'node-fetch';
import { getDid, createConnectionInvitation } from './src/api.js';
import { RegisterBody, TokenJSON, WalletResponse, WalletsResponse } from './types.js';
import Events from './src/Events.js';
import { determinePort } from './src/util.js';
const app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
);
const server = createServer(app);


const io = new Server(server);
const args = process.argv.slice(2);
const port_arg = args.find(arg => {
    console.log(arg.split('=')[0]);
    return arg.split('=')[0]==='port';
});
const port_arg_value = port_arg?port_arg.split('=')[1]:null;
const port_env = process.env.PORT;

const port = determinePort(port_env,port_arg_value,'4000');

let unusedport = port;
console.log(port);

const agency_url = 'http://13.79.168.138:8080';
const register_url = 'http://13.79.168.138';

const createWallet = async (wallet_name?:String): Promise<WalletResponse> => {
    try {
        const response = await fetch(`${agency_url}/multitenancy/wallet`, {
            method: 'POST',
            body: JSON.stringify({
                label: 'Powah',
                wallet_dispatch_type: 'default',
                wallet_key: 'PowahTestiAvain123',
                wallet_name: wallet_name,
                wallet_type: 'indy'
            }),
        });
        if(response.status === 200){
            const json:any = await response.json();
            return json;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const updateWallet =  async (wallet_id:String): Promise<WalletResponse> => {
    try {
        const response = await fetch(`${agency_url}/multitenancy/wallet/${wallet_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                wallet_webhook_urls: [
                    //`http://localhost:${unusedport}/webhook`,
                    `${register_url}:4000/webhook`,
                ]
            }),
        });
        if(response.status === 200){
            const json:any = await response.json();
            console.log('update response', json);
            return json;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getWallets = async (wallet_name?: String) : Promise<WalletsResponse> => {
    console.log('---> getWallets');
    //const response = await fetch(`${agency_url}/multitenancy/wallets?wallet_name=${wallet_name}`);
    const response = await fetch(`${agency_url}/multitenancy/wallets${wallet_name? '?wallet_name='+wallet_name: ''}`);
    const json:any = await response.json();
    console.log('<--- getWallets', json);
    return json;
}

const getWallet = async (id?: String) : Promise<WalletResponse> => {
    const response = await fetch(`${agency_url}/multitenancy/wallet/${id}`);
    const json:any = await response.json();
    console.log('getWallet', json);
    return json;
}



const register = async (did,verkey,alias = null, role = 'ENDORSER') => {
    let body:RegisterBody = {did:did, verkey:verkey, role: role};
    if(alias){
        body.alias = alias;
    }
    try {
        const response = await fetch(`${register_url}/register`, {
            method: 'POST',
            body: JSON.stringify({
                did: did,
                verkey: verkey,
                alias: alias
            }),
        });
        console.log('register response', response);
        const json = await response.json();
        console.log('json', json);
        return json;
    }catch(error){
        console.error(error);
    }
}

const assignPublic = async(token, did) => {
    const response = await fetch(`${agency_url}/wallet/did/public?did=${did}`, {
        method: 'Post',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(response);
}


const getPublic = async(token, did) => {
    const response = await fetch(`${agency_url}/wallet/did/public`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(response);
    if(response.status === 200){
        const json = await response.json();
        return json;
    }else{
        return null;
    }
}

const getStatus = async () => {
    try {
        const response = await fetch(`${agency_url}/status`);
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getToken = async (id) => {
    try {
        const response = await fetch(`${agency_url}/multitenancy/wallet/${id}/token`, {
            method: 'POST',
            body: JSON.stringify({

            })
        });
        const json:TokenJSON = await response.json();
        const token = json.token;
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}
    
const main = async(req) => {
    if(!req.session.token){
        const name = 'Powah';
        const response = await getStatus();
        //console.log('status', response.status);
        const wallet_name = `Testi_${name}_Lompakko`;
        if(response.status === 200){
            console.log('connection ok');
        }
        const existing_wallet = (await getWallets(wallet_name)).results[0];
        let token;
        let walletid;
        if(existing_wallet){
            const all_wallet_info = await getWallet(existing_wallet.wallet_id);
            walletid = existing_wallet.wallet_id;
            const wallet_id = existing_wallet.wallet_id;
            //console.log('existing wallet', wallet_id);
            const webhook_urls:string[] = all_wallet_info.settings['wallet.webhook_urls'];
            console.log('wallet_webhook', webhook_urls);
            if(webhook_urls.length === 0 || webhook_urls.indexOf(`${register_url}:4000/webhook`) === -1){
                updateWallet(existing_wallet.wallet_id);
                const webhook_urls = all_wallet_info.settings['wallet.webhook_urls'];
                console.log('wallet_webhook', webhook_urls);
            }
            token = await getToken(wallet_id);
        }else{
            const new_wallet = await createWallet(wallet_name);
            if(new_wallet){
                token = new_wallet.token;
                walletid = new_wallet.wallet_id;
            }
        }
        //console.log('token', token);
        if(token){
            req.session.token = token;
            req.session.save();
        }
        const did:any = await getDid(token);
        //console.log('did', did);
        const publicDid:any  = await getPublic(token, did.did);
        if(publicDid.result){
            // do nothing for now
        }else{
            const register_result = await register(did.did, did.verkey, name);
            //console.log('registered a did', register_result);
            await assignPublic(token,did.did);
        }
    }
}

/** init websocket stuff */
socket(io);

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: false}));

app.use(async(req,res,next)=>{
    await main(req);
    next();
});

app.use('/api', apiRouter);

const events = Events();

app.use('/webhook', async(req,res,next) => {
    console.log('received something', req);
    const walletId = req.get('x-wallet-id');
    console.log('body', req.body);
    //const data = JSON.parse(req.body);
    console.log('origURL', req.originalUrl);
    console.log('path', req.path);
    console.log('wallet: ', walletId);
    events.send('new', {type: req.path, data:req.body});
    res.status(200).send();
    next();
});

app.use('/events', async(req,res,next) =>{
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();
    res.write('retry: 10000\n\n');
    events.on('new', (data) => {
        console.log('SENDING EVENT TO CLIENT', data);
        res.write(`data: ${JSON.stringify(data)} \n\n`)
    });
});

app.get('/', (req, res) => {
    res.sendFile(dirname(fileURLToPath(import.meta.url))+'/virta/index.html');
})
console.log('path', dirname(fileURLToPath(import.meta.url)));
app.use(express.static('bin/virta'));

server.listen(port, () => {
    console.log(`server listening on port ${port}.`);
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

process.on('SIGINT', () => {
    console.log("exiting");
    process.exit(0);
})