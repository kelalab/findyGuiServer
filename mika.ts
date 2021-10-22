import express from 'express';
import session from 'express-session';
const app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
import { createServer } from 'http';
const server = createServer(app);
import { Server } from 'socket.io';
import socket from './websocket.js';
import fetch from 'node-fetch';
import fs from 'fs';

const io = new Server(server);
const args = process.argv.slice(2);
const port_arg = args.find(arg => {
    console.log(arg.split('=')[0]);
    return arg.split('=')[0]==='port';
});
const port = port_arg && port_arg.split('=')[1] || '4000';
console.log(port);

const agency_url = 'http://13.79.168.138:8080';

const createWallet = async (wallet_name?:String) : Promise<WalletResponse> => {
    try {
        const response:any = await fetch(`${agency_url}/multitenancy/wallet`, {
            method: 'POST',
            body: JSON.stringify({
                label: 'Mika',
                wallet_dispatch_type: 'default',
                wallet_key: 'MikanTestiAvain123',
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

interface WalletsResponse{
    results: [
        {
            created_at: string,
            wallet_id: string,
            updated_at: string,
            settings: Object,
            key_manamegent_mode: string
        }
    ]
}

const getWallets = async (wallet_name?: String) : Promise<WalletsResponse>=> {
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

const getDid = async (token: String) => {
    const create = false;
    const existing_res = await fetch(`${agency_url}/wallet/did`,{
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const existing:any = await existing_res.json();
    if(existing){
        console.log('existing dids: ', existing);
        const resultarray = existing.results;
        return resultarray[0];
    }
    //return null;
    if(create){
        const response = await fetch(`${agency_url}/wallet/did/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await response.json();
        return json;
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

const getConnections = async(token, mydid) => {
    try {
        const response = await fetch(`${agency_url}/connections?my_did=${mydid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const json:any = await response.json();
        console.log('connections', json)
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface WalletResponse {
    wallet_id: string,
    created_at: string,
    key_management_mode: string,
    updated_at: string,
    settings: {
      'wallet.type': string,
      'wallet.name': string,
      'wallet.webhook_urls': [],
      'wallet.dispatch_type': string,
      default_label: string,
      'wallet.id': string
    },
    token: string
}
    
let token;

const main = async() => {
    const name = 'Powah';
    const response = await getStatus();
    console.log('status', response.status);
    const wallet_name = `Testi_${name}_Lompakko`;
    if(response.status === 200){
        console.log('connection ok');
    }
    const existing_wallet = (await getWallets(wallet_name)).results[0];
    let walletid = existing_wallet.wallet_id;
    if(existing_wallet){
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
    console.log('did', did.did);
    const connections = await getConnections(token, did.did);
}

main();

/** init websocket stuff */
socket(io);

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: false}))
//app.use('/api', apiRouter);

app.post('/accept-invitation', async(req,res,next) => {
    console.log('accept-invitation call', req);
    console.log(req.body);
    console.log('invdata', req.body.invitation);
    console.log(req.body.invitation.connection_id);
    const invitation = JSON.parse(req.body.invitation);
    console.log('invitation', invitation);
    console.log('session', req.session);
    console.log('tkn', token);
    const response = await fetch(`${agency_url}/connections/receive-invitation`, {
        method: 'POST',
        body: JSON.stringify(invitation),
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const json:any = await response.json();
    const conn_id = json.connection_id;
    console.log('receive invitation', json);
    const response2 = await fetch(`${agency_url}/connections/${conn_id}/accept-invitation`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log('response2', response2);
    const json2 = await response2.json();
    console.log('accept invitation', json2);
    res.status(200).send();
})

app.use(express.static('mika'));

server.listen(port, () => {
    console.log(`server listening on port ${port}.`);
});

let unusedport = port;

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