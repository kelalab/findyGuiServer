import express from 'express';
import session from 'express-session';
const app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
import { createServer } from 'http';
const server = createServer(app);
import { Server } from 'socket.io';
import socket from './websocket.js';
import fetch from 'node-fetch';
import apiRouter, { getDid } from './api.js';

const io = new Server(server);
const args = process.argv.slice(2);
const port_arg = args.find(arg => {
    console.log(arg.split('=')[0]);
    return arg.split('=')[0]==='port';
});
const port_arg_value = port_arg?port_arg.split('=')[1]:null;
const port_env = process.env.PORT;

const determinePort = (...args) => {
    for(const arg of args){
        console.log(arg);
        if(arg && arg.length>0){
            return arg;
        }
    }
    return '';
}

const port = determinePort(port_env,port_arg_value,'4000');

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

const updateWallet =  async (wallet_id:String): Promise<WalletResponse> => {
    try {
        const response = await fetch(`${agency_url}/multitenancy/wallet/${wallet_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                wallet_webhook_urls: [
                    //`http://localhost:${unusedport}/webhook`,
                    `${agency_url.replace(':8080','')}:${port}/webhook`,
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

const main = async(req) => {
    if(!req.session.token){
        const name = 'Mika';
        const response = await getStatus();
        console.log('status', response.status);
        const wallet_name = `Testi_${name}_Lompakko`;
        if(response.status === 200){
            console.log('connection ok');
        }
        const existing_wallet = (await getWallets(wallet_name)).results[0];
        let walletid;
        if(existing_wallet){
            const all_wallet_info:any = await getWallet(existing_wallet.wallet_id);
            walletid = existing_wallet.wallet_id;
            const wallet_id = existing_wallet.wallet_id;
            console.log('existing wallet', wallet_id);
            const webhook_urls:string[] = all_wallet_info.settings['wallet.webhook_urls'];
            console.log('wallet_webhook', webhook_urls);
            if(webhook_urls.length === 0 || webhook_urls.indexOf(`${agency_url.replace(':8080','')}:${port}/webhook`) === -1){
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
        console.log('token', token);
        req.session.token = token;
        req.session.save();
        const did:any = await getDid(token);
        if(did){
            console.log('did', did.did);
            const connections = await getConnections(token, did.did);
        }
    }
}

/** init websocket stuff */
socket(io);

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: false}))
//app.use('/api', apiRouter);

app.use((req,res,next)=>{
    main(req);
    next();
});

const Events = () => {
    const listeners =  new Map<String, Function>();
    const on = (evt, callback) => {
        listeners.set(evt, callback);
    };
    const send = (evt, data) => {
        const callback = listeners.get(evt);
        callback(data);
    }
    return {
        on:on,
        send:send
    }
};

const events = Events();

app.use('/webhook', async(req,res,next) => {
    console.log('received something', req);
    const walletId = req.get('x-wallet-id');
    console.log('body', req.body);
    //const data = JSON.parse(req.body);
    console.log('wallet: ', walletId);
    events.send('new', req.body);
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
app.use('/api', apiRouter);
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

process.on('SIGINT', () => {
    console.log("exiting");
    process.exit(0);
});