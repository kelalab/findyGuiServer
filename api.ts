import Express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const dir = path.dirname(__filename);
const apiRouter = new Express.Router();

let connections:any[] = null;

apiRouter.get('/api/hello', (req, res, next) => {
    console.log('call registered');
    res.status(200).send();
    next();
});

apiRouter.get('/connections', async (req, res, next) => {
    console.log('connections call registered');
    const obj = await getConnections();
    res.json(obj);
});

export const getConnections = async() => {
    if(!connections){
        const data: any = await readFile('mock/connections.json');
        const obj = JSON.parse(data);
        connections = obj;
        return obj;
    }
    return connections;
}

export const updateConnection = async(connection) => {
    const existing:any[] = await getConnections();
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

export default apiRouter;