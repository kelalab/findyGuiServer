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
    const response = await sendMessage(recipient, message, token);
    console.log(response);
    if(response.status===200){
        const json = await response.json();
        console.log(json);
        res.status(200).send();
    }
    res.status(500).send();
});
/**
 * 
 * @param recipient connection_id of the connection where msg is sent
 * @param message string message
 * @param token authorization token for the wallet
 * @returns 
 */
export const sendMessage = async(recipient, message, token) => {
    console.log('--> sending msg', recipient, message);
    return fetch(`${AGENCY_URL}/connections/${recipient}/send-message`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({content: message})
    });
}

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

apiRouter.post('/credential/issue', async(req,res,next) => {
    console.log('---> issuing a credential');
    const token = req.session.token;
    const data_json = JSON.parse(req.body);
    const cred_ex_id = data_json.cred_ex_id;
    const issue_resp = await issue(cred_ex_id, token);
    console.log('issue_resp', issue_resp);
});

export const issue = async(cred_ex_id, token) => {
    return fetch(`${AGENCY_URL}/issue-credential/records/${cred_ex_id}/issue`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            comment: 'powah issued'
        })
    });
}

apiRouter.post('/credential/offer', async(req,res,next)=> {
    console.log('---> creating a credential offer');
    const token = req.session.token;
    const data_json = JSON.parse(req.body);
    const connection_id = data_json.connection;
    const send_offer_resp = await createCredOffer(connection_id,[
        {
            'mime-type': 'text/plain',
            'name': 'student_id',
            'value': 'alice_id'
        },
        {
            'mime-type': 'text/plain',
            'name': 'active',
            'value': 'true'
        }
    ] , 'student_db_schema', token);
    console.log(send_offer_resp);
    res.status(200).send();
});

/**
 * 
 * @param connection_id 
 * @param attributes array of attributes in the form of {'mime-type':x, 'name':y, 'value':z}
 * @param schema_name schema_name of the credential to issue
 * @param token 
 * @returns 
 */
export const createCredOffer = async(connection_id, attributes, schema_name, token) =>{
    const cred_defs:any = await getCredDefs(token);
    console.log('--- credential_definitions', cred_defs);
    //check definitions to find the one to be used
    let idx = 0;
    for(const id of cred_defs.credential_definition_ids){
        const cred_def = await getCredDefs(token, id);
        const schema:any = await getSchemas(token, cred_def.credential_definition.schemaId);
        console.log('schema', schema);
        console.log('cred_def', cred_def);
        // if schema name used by cred_def equals provided, we can break off the loop
        if(schema.name === schema_name){
            break;
        }
        
        idx++;
    }
    const cred_def_id = cred_defs.credential_definition_ids[idx];
    console.log('idx', idx);
    console.log('id', cred_def_id);
    return fetch(`${AGENCY_URL}/issue-credential/send-offer`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            connection_id: connection_id,
            cred_def_id: cred_def_id,
            credential_preview: {
                '@type': 'issue-credentials/1.0/credential_preview',
                'attributes': attributes
            }
        })
    });
}

interface Cred_def_resp{
    credential_definition_ids?: []
    credential_definition?:{ 
        ver:string,
        id:string,
        schemaId:string,
        type:string,
        tag:string,
        value: {
            primary: any
        }
    }
}

export const getCredDefs = async(token:string, id?:string):Promise<Cred_def_resp> => {
    if(id){
        const data = await fetch(`${AGENCY_URL}/credential-definitions/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data.json();
    }
    const data = await fetch(`${AGENCY_URL}/credential-definitions/created`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return data.json();
}

export const getSchemas = async (token, id?) => {
    if(id){
        const resp = await fetch(`${AGENCY_URL}/schemas/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        try{
            const json:any = await resp.json();
            //console.log('schemasjson', json);
            return json.schema;
        }catch(error){
            console.error('not json')
            return [];
        }
    }
    const resp = await fetch(`${AGENCY_URL}/schemas/created`, {
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

/**
 * 
 * @param token 
 * @param conn_id 
 * @returns 
 */
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
    console.log('existing did res', existing_res);
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

export const sendProofRequest = async (connection_id, schema_name, token) => {
    const cred_defs:any = await getCredDefs(token);
    console.log('--- credential_definitions', cred_defs);
    //check definitions to find the one to be used
    let idx = 0;
    for(const id of cred_defs.credential_definition_ids){
        const cred_def = await getCredDefs(token, id);
        const schema:any = await getSchemas(token, cred_def.credential_definition.schemaId);
        console.log('schema', schema);
        console.log('cred_def', cred_def);
        // if schema name used by cred_def equals provided, we can break off the loop
        if(schema.name === schema_name){
            break;
        }
        
        idx++;
    }
    const cred_def_id = cred_defs.credential_definition_ids[idx];
    let now = new Date().getTime();
    let from = now - 7*24*60*60*1000;
    const response = await fetch(`${AGENCY_URL}/present-proof/send-request`, {
        method: 'POST',
        body: JSON.stringify({
            "comment": "present identity",
            "connection_id": connection_id,
            "proof_request": {
                "name": "Proof of identity",
                "version": "1.0",
                "nonce": "54321",
                "requested_attributes": {
                    "0_ssn": {
                        "name": "ssn",
                        "restrictions": [
                            {
                                "cred_def_id": cred_def_id
                            }
                        ],
                        "non_revoked": {
                            "from": from,
                            "to": now
                        }
                    }
                },
                "requested_predicates":{
                }
            },
            "trace": false
        }),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    });
    console.log('proof request response', response);
    const json = await response.json();
    console.log('proof request json', json);
}

/**
 * Verify an incoming proof
 * @param credential_exchange_id 
 * @param token 
 * @returns 
 */
export const verifyProof = async(credential_exchange_id, token) => {
    const resp = await fetch(`${AGENCY_URL}/present-proof/records/${credential_exchange_id}/verify-presentation`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }});
    return resp.json();
}

export default apiRouter;