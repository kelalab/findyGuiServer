import Express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { AGENCY_URL } from '../constants.js';

const __filename = fileURLToPath(import.meta.url);
const dir = path.dirname(__filename);
const apiRouter = new Express.Router();
const mock = false;

let connections:any[] = null;

apiRouter.get('/api/hello', (req, res, next) => {
    console.log('call registered');
    res.status(200).send();
    next();
});

apiRouter.get('/connections/:conn_id', async (req, res, next) => {
    console.log('connections call registered');
    const token = req.session.token;
    const conn_id = req.params.conn_id;
    const obj = await getConnections(token, conn_id);
    res.json(obj);
});

apiRouter.get('/create_invitation', async (req, res, next) => {
    console.log('requesting new invitation', req.session);
    let invitation:any;
    if(!req.session.invitation){
        const token = req.session.token;
        console.log('token', token);
        invitation = await createConnectionInvitation(token, true);
        console.log('invitation', invitation);
        req.session.invitation = invitation;
        req.session.save();
    }else{
        invitation = req.session.invitation;
    }
    res.status(200).json(JSON.stringify(invitation.invitation));
    next();
});

apiRouter.get('/check_invitation', async (req, res, next) => {
    console.log('check invitation');
    const invitation = req.session.invitation;
    if(invitation){
        const conn_id = invitation.connection_id;
        console.log('connection id to check: ', conn_id);
        const token = req.session.token;
        let conn = await getConnections(token, conn_id);
        console.log('connection: ', conn);
        res.json(JSON.stringify(conn));
    }
});

apiRouter.post('/send_message', async (req,res,next) => {
    console.log('sending message');
    const msg = req.body;
    const msg_json = JSON.parse(req.body);
    const recipient = msg_json.recipient;
    const message = msg_json.message;
    const token = req.session.token;
    console.log('msg', msg, recipient, message);
    const response = await fetch(`${AGENCY_URL}/connections/${recipient}/send-message`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({content: message})
    });
    console.log(response);
    if(response.status===200){
        const json = await response.json();
        console.log(json);
        res.status(200).send();
    }
    res.status(500).send();
});

apiRouter.get('/connections', async (req,res,next)=>{
    console.log('----> fetching connections');
    const token = req.session.token;
    console.log('token', token);
    const connections = await getConnections(token);
    console.log('all connections', connections)
    const response = connections.results.filter(c => c.state === 'response' || c.state === 'active');
    console.log('<--- connections', response)
    res.json(response);
});

export const getConnections = async(token, conn_id=null) => {
    if(conn_id){
        const data = await fetch(`${AGENCY_URL}/connections/${conn_id?conn_id:''}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await data.json();
        return json;
    }else{
        if(mock && !connections){
            const data: any = await readFile('mock/connections.json');
            const obj = JSON.parse(data);
            connections = obj;
            return obj;
        }
        const data = await fetch(`${AGENCY_URL}/connections`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(data.status === 200){
            const json = await data.json();
            return json;
        }
        else{
            console.log(data.status);
        } 
    }
}

export const updateConnection = async(connection) => {
    const existing:any[] = await getConnections(null);
    const removeSameId = existing.filter(x => x.id !== connection.id)
    const updated = [...removeSameId, connection];
    connections = updated;
    console.log(updated);
    return connections;
}

apiRouter.get('/proofs', async (req, res, next) => {
    console.log('proofs call registered');
    const data: any = await readFile('mock/proofs.json');
    console.log(data);
    const obj = JSON.parse(data);
    res.json(obj);
});

const readFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(dir, filePath), 'utf8', (err, data) => {
            console.log('err:', err, 'data:', data);
            if (err) {
                // do something, log an error maybe
            } else {
                resolve(data);
            }
        });
    })

}

export const getDid = async (token: String) => {
    const create = false;
    const existing_res = await fetch(`${AGENCY_URL}/wallet/did`,{
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const existing:any = await existing_res.json();
    console.log('existing dids: ', existing);
 
    if(existing && existing.results && existing.results.length > 0){
        console.log('existing dids: ', existing);
        const resultarray = existing.results;
        return resultarray[0];
    } else{
        const response = await fetch(`${AGENCY_URL}/wallet/did/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const json:any = await response.json();
        console.log('created a new did', json);
        return json.result;
    }
}

export const createConnectionInvitation = async (token, autoAccept = false) => {
    const body = {};
    const response = await fetch(`${AGENCY_URL}/connections/create-invitation?auto_accept=${autoAccept}`, {
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

export default apiRouter;