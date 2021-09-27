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
const port = port_arg && port_arg.split('=')[1] || 4000;
console.log(port);

const agency_url = 'http://13.79.168.138:8080';

const createWallet = async (wallet_name?:String) => {
    try {
        const response = await fetch(`${agency_url}/multitenancy/wallet`, {
            method: 'POST',
            body: JSON.stringify({
                label: 'Testi_Anna',
                wallet_dispatch_type: 'default',
                wallet_key: 'OmaTestiAvain123',
                wallet_name: wallet_name,
                wallet_type: 'indy'
            }),
        });
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getWallets = async (wallet_name?: String) => {
    console.log('---> getWallets');
    //const response = await fetch(`${agency_url}/multitenancy/wallets?wallet_name=${wallet_name}`);
    const response = await fetch(`${agency_url}/multitenancy/wallets${wallet_name? '?wallet_name='+wallet_name: ''}`);
    const json = await response.json();
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
    const response = await fetch(`${agency_url}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
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

interface WalletResponse {
    wallet_id: String,
    created_at: String,
    key_management_mode: String,
    updated_at: String,
    settings: {
      'wallet.type': 'indy',
      'wallet.name': 'Testi_Anna_Lompakko2',
      'wallet.webhook_urls': [],
      'wallet.dispatch_type': 'base',
      default_label: 'Testi_Anna',
      'wallet.id': '3251082c-8d05-4711-9dd4-d5fcebf3ee8d'
    },
    token: String
}
    
try{
    getStatus().then((response:any) => {
        console.log(response);
        const wallet_name = 'Testi_Anna_Lompakko';
        try{
            if (response.status === 200) {
                console.log('connection ok');
                createWallet(wallet_name).then(walletresponse => {
                    console.log(walletresponse);
                    if (walletresponse.status === 200) {
                        walletresponse.json().then((json:WalletResponse) => {
                            console.log('json', json);
                            const token:String = json.token;

                        });
                    } else {
                        openSesame(wallet_name);
                    }
                })
            }
        }catch(e){
            console.log(e);
        }
    });
}catch(error){
    console.error('no connection to ledger');
}

const openSesame = async(wallet_name: String) => {
    const wallets:any = await getWallets(wallet_name);
    const mywallet = wallets.results[0];
    console.log(mywallet);
    console.log('wallet', mywallet);
    await getWallet(mywallet.wallet_id);
    const token = await getToken(mywallet.wallet_id);
    console.log('token acquired: ', token);
}

/** init websocket stuff */
socket(io);

app.use('/api', apiRouter);

app.use(express.static('front/build'));

server.listen(port, () => {
    console.log(`server listening on port ${port}.`);
});