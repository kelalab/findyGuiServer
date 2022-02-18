import express from 'express';
import session from 'express-session';
import process from 'process';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import { createServer } from 'http';
import apiRouter, { createCredOffer, issue, sendMessage, sendProofRequest, verifyProof } from './src/api.js';
import { Server } from 'socket.io';
import socket from './websocket.js';
import fetch from 'node-fetch';
import { getDid } from './src/api.js';
import { RegisterBody, SchemaJSON, TokenJSON, WalletResponse, WalletsResponse } from './types.js';
import Events from './src/Events.js';
import { determinePort } from './src/util.js';
import { AGENCY_URL } from './constants.js';
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

const webhook_env = process.env.WEBHOOK_URL;

const port_arg_value = port_arg?port_arg.split('=')[1]:null;
const port_env = process.env.PORT;

console.log('agency url',AGENCY_URL);

const von_web_arg = args.find(arg => arg.split('=')[0].toLowerCase()==='von_webserver_url');
const von_web_env = process.env.VON_WEBSERVER_URL;
let von_web_arg_val;
if(von_web_arg){
    von_web_arg_val = von_web_arg.split('=')[1];
}else if(von_web_env){
    von_web_arg_val = von_web_env;
}
console.log('vonurl',von_web_arg_val);

const port = determinePort(port_env,port_arg_value,'4000');

let unusedport = port;
console.log(port);

const machine = {
    state: 'IDLE',
    transitions: {
        IDLE: {
            listen() {
                this.state = 'LISTENING'
            }
        },
        LISTENING: {
            getProof() {
                this.state = 'REQUEST_PROOF'
            },
            cancel() {
                this.state = 'IDLE'
            }
        },
        REQUEST_PROOF: {
            ok() {
                this.state = 'ISSUE'
            },
            fail(){
                this.state = 'IDLE'
            }
        },
        ISSUE: {
            cancel() {
                this.state = 'IDLE'
            },
            done() {
                this.state = 'IDLE'
            }
        }
    },
    dispatch(actionName){
        const action = this.transitions[this.state][actionName];
        if (action) {
            action.call(this);
        } else {
            console.log('invalid action');
        }
    }
}

const agency_url = AGENCY_URL;
const register_url = von_web_arg_val || agency_url.replace(':8080', '');
const machines = new Map<string, any>();

const createWallet = async (wallet_name?:String): Promise<WalletResponse> => {
    try {
        const response = await fetch(`${agency_url}/multitenancy/wallet`, {
            method: 'POST',
            body: JSON.stringify({
                label: 'Opiskelijatietokanta',
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
                    `${webhook_env? webhook_env: register_url+':4000/webhook'}`,
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



const createSchemaAndCredDef = async (token) => {
    console.log('create_schema', token);
    const schema = {
        schema_name: 'student_db_schema',
        schema_version: '1.0',
        attributes: [
            'student_id',
            'active'
        ]   
    }
    const body = JSON.stringify(schema);
    console.log('schema', body);
    const resp = await fetch(`${agency_url}/schemas`, {
        method: 'POST',
        body: body,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    });
    //console.log(resp);
    const json:SchemaJSON = await resp.json();
    console.log(json);
    const schema_id = json.schema_id;
    const creddef = JSON.stringify({
        support_revocation: false,
        tag: 'default',
        schema_id: schema_id
    });
    const cred_resp = await fetch(`${agency_url}/credential-definitions`, {
        method: 'POST',
        body: creddef,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    });
    console.log(cred_resp);
    const cred_json:any = await cred_resp.json();
    console.log('creddef', cred_json);
}

const getSchemas = async (token) => {
    const resp = await fetch(`${agency_url}/schemas/created`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(resp);
    try{
        const json = await resp.json();
        console.log('schemasjson', json);
        return json;
    }catch(error){
        console.error('not json')
        return [];
    }
}
    
const main = async(req) => {
    const name = 'Virta';
    const wallet_name = `Testi_${name}_Lompakko`;
    let existing_wallet;
    /** check for wallet in req session */
    if(!req.session.wallet){
        console.log('set wallet in session');
        existing_wallet = (await getWallets(wallet_name)).results[0];
        req.session.wallet = existing_wallet;
    }else{
        console.log('get wallet in session');
        existing_wallet = req.session.wallet;
    }
    /** check for wallet info in req session */
    let all_wallet_info;
    if(!req.session.wallet_info && existing_wallet){
        console.log('set wallet info in session', existing_wallet);
        all_wallet_info = await getWallet(existing_wallet.wallet_id);
        req.session.wallet_info = all_wallet_info;
    }else if(req.session.wallet_info && existing_wallet){
        console.log('get wallet info in session');
        all_wallet_info = req.session.wallet_info;
    }
    if(all_wallet_info){
        const webhook_urls:string[] = all_wallet_info.settings['wallet.webhook_urls'];
        console.log('wallet_webhooks, no update', webhook_urls);
        if(webhook_urls.length === 0 || webhook_urls.indexOf(`${webhook_env}`) === -1){
            await updateWallet(existing_wallet.wallet_id);
            const webhook_urls = all_wallet_info.settings['wallet.webhook_urls'];
            console.log('wallet_webhooks after update', webhook_urls);
        }
    }

    /** rest of init logic */
    if(!req.session.token){
        const response = await getStatus();
        //console.log('status', response.status);
        if(response.status === 200){
            console.log('connection ok');
        }
        let token;
        let walletid;
        if(existing_wallet){
            walletid = existing_wallet.wallet_id;
            const wallet_id = existing_wallet.wallet_id;
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
            const schemas:any = await getSchemas(token);
            if( schemas.schema_ids.length === 0){
                console.log('no schemas?');
                try{
                    await createSchemaAndCredDef(token);
                }catch(ex){
                    console.error(ex);
                }
            }
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

const stateLoop = async(event, path, token) => {
    switch(path){
    case '/topic/basicmessages/': {
        const {content, connection_id, message_id, state} = event;
        let _machine;
        if(!machines.get(connection_id)){
            _machine = Object.create(machine);
        }else{
            _machine = machines.get(connection_id);
        }
        
        // needs a finite state machine here
        console.log('mac state', _machine.state);
        console.log('content', content);
        switch(_machine.state){
        case 'IDLE':
            await sendMessage(connection_id, 'Kuinka voin auttaa? Olen vain esimerkkitoteutus opiskelijatietokannasta, joten voin tarjota sinulle mock-opiskelijatunnuksen henkilöllisyystodistusta vastaan jos vastaat tähän viestiin "1"', token);
            // start listening
            _machine.dispatch('listen');
            machines.set(connection_id,_machine);
            break;
        case 'LISTENING':
            console.log('listen answer', content);
            if(content === '1'){
                console.log('requesting proof');
                await sendProofRequest(connection_id, 'identity_schema',token);
                /*await createCredOffer(connection_id,[
                    {
                        'mime-type': 'text/plain',
                        'name': 'name',
                        'value': 'Alice A'  
                    },
                    {
                        'mime-type': 'text/plain',
                        'name': 'ssn',
                        'value': '012345-789B'
                    }
                ] , 'identity_schema' , token);*/
                _machine.dispatch('getProof');
                machines.set(connection_id,_machine);
            }else{
                console.log('input not one');
                await sendMessage(connection_id, 'Kiitos. Palataan asiaan kun tarvitset todisteen identiteetistä.', token);
                _machine.dispatch('issue');
                machines.set(connection_id,_machine);
            }
            break;
        case 'REQUEST_PROOF':
            console.log('waiting proof');
            break;
        case 'ISSUE':
            _machine.dispatch('cancel');
            machines.set(connection_id, _machine);
            break;
        }
        console.log(_machine);
        break;
        
    }
    case '/topic/present_proof/': {
        const {content, connection_id, state, presentation_exchange_id} = event;
        const result = await verifyProof(presentation_exchange_id, token);
        console.log('verify result', result);
        break;
    }
    case '/topic/issue_credential/': {
        const {content, connection_id, message_id, state, credential_exchange_id} = event;
        let _machine;
        if(!machines.get(connection_id)){
            _machine = Object.create(machine);
        }else{
            _machine = machines.get(connection_id);
        }
        switch(_machine.state){
        case 'ISSUE':
            console.log('issue credential stuff');
            if(state==='request_received'){
                await issue(credential_exchange_id, token);
                _machine.dispatch('done');
                machines.set(connection_id,_machine);
            }else{
                console.log('waiting for cred request');
            }
            break;
        }
        console.log(event);
        break;
    }
    default:
        break;
    }
}

app.use('/webhook', async(req,res,next) => {
    console.log('received something', req);
    const walletId = req.get('x-wallet-id');
    console.log('body', req.body);
    const token = req.session.token;
    //const data = JSON.parse(req.body);
    console.log('origURL', req.originalUrl);
    console.log('path', req.path);
    console.log('wallet: ', walletId);
    stateLoop(req.body, req.path, token)
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