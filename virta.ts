import express from 'express';
import { createServer } from 'http';
const app = express();
const server = createServer(app);
import apiRouter from './api.js';
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

interface RegisterBody{
    did: string,
    verkey: string,
    alias?: string,
    role: string
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

const createConnectionInvitation = async (token, autoAccept = true) => {
    const body = {};
    const response = await fetch(`${agency_url}/connections/create-invitation?autoAccept=${autoAccept}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const json = await response.json();
    //console.log('invitation', json);
    return json;
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
    
const main = async() => {
    const name = 'Powah';
    const response = await getStatus();
    console.log('status', response.status);
    const wallet_name = `Testi_${name}_Lompakko`;
    if(response.status === 200){
        console.log('connection ok');
    }
    const existing_wallet = (await getWallets(wallet_name)).results[0];
    const all_wallet_info = await getWallet(existing_wallet.wallet_id);
    let token;
    let walletid = existing_wallet.wallet_id;
    if(existing_wallet){
        const wallet_id = existing_wallet.wallet_id;
        console.log('existing wallet', wallet_id);
        const webhook_urls = all_wallet_info.settings['wallet.webhook_urls'];
        console.log('wallet_webhook', webhook_urls);
        if(webhook_urls.length === 0){
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
    const did:any = await getDid(token);
    console.log('did', did);
    const publicDid = await getPublic(token, did.did);
    if(publicDid){
        console.log('public did', publicDid);
        const invitation = await createConnectionInvitation(token);
        console.log('invitation', JSON.stringify(invitation));
    }else{
        const register_result = await register(did.did, did.verkey, name);
        await assignPublic(token,did.did);
    }
    getConnections(token);
}

main();

/** init websocket stuff */
socket(io);

app.use('/api', apiRouter);
app.use('/webhook', async(req,res,next) => {
    console.log('received something', req);
    next();
});
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
                console.log(`virta controller listening on port ${unusedport}.`);
            });
        }, 1000);
    }
});