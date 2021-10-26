import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
const app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
);
const server = createServer(app);
import apiRouter from './api.js';
import { Server } from 'socket.io';
import socket from './websocket.js';
import fetch from 'node-fetch';
import fs from 'fs';
import { getDid } from './api.js';
import { WalletResponse, WalletsResponse } from './types.js';

const io = new Server(server);
const args = process.argv.slice(2);
const port_arg = args.find(arg => {
    console.log(arg.split('=')[0]);
    return arg.split('=')[0]==='port';
});
const port = port_arg && port_arg.split('=')[1] || '4000';
let unusedport = port;

console.log(port);

const agency_url = 'http://13.79.168.138:8080';

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
                    `http://localhost:${unusedport}/webhook`
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

const getWallet = async (id?: String) => {
    const response = await fetch(`${agency_url}/multitenancy/wallet/${id}`);
    const json = await response.json();
    console.log('getWallet', json);
    return json;
}

const createDid = async (token: String) => {
    const response = await fetch(`${agency_url}/wallet/did/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const json = await response.json();
    return json;
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

const getConnections = async(token, mydid=null) => {
    try {
        const response = await fetch(`${agency_url}/connections${mydid?`?my_did=${mydid}`:''}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const json:any = await response.json();
        //console.log('connections', json)
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface TokenJSON {
    token?: String,
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
    
const main = async() => {
    const name = 'Powah';
    let token;
    const response = await getStatus();
    console.log('status', response.status);
    const wallet_name = `Testi_${name}_Lompakko`;
    if(response.status === 200){
        console.log('connection ok');
    }
    const existing_wallet = (await getWallets(wallet_name)).results[0];
    let walletid;
    if(existing_wallet){
        const all_wallet_info = await getWallet(existing_wallet.wallet_id);
        walletid = existing_wallet.wallet_id;
        const wallet_id = existing_wallet.wallet_id;
        console.log('existing wallet', wallet_id);
        token = await getToken(wallet_id);
    }else{
        const new_wallet = await createWallet(wallet_name);
        if(new_wallet){
            token = new_wallet.token;
            walletid = new_wallet.wallet_id;
        }
    }
    console.log('token', token);
    const did:any = await getDid(token);
    if(did){
        console.log('did', did.did);
        const connections = await getConnections(token, did.did);
    }
}

main();

/** init websocket stuff */
socket(io);

app.use('/api', apiRouter);

app.use(express.static('front/build'));

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
                console.log(`user controller listening on port ${unusedport}.`);
            });
        }, 1000);
    }
});