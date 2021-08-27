import Express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const dir = path.dirname(__filename);
const apiRouter = new Express.Router();
console.log(dir);
apiRouter.get('/api/hello', (req,res,next) => {
    console.log('call registered');
    res.status(200).send();
    next();
});

apiRouter.get('/connections', async(req,res,next) => {
    console.log('connections call registered');
    const data:any = await readFile('mock/connections.json');
    console.log(data);
    const obj = JSON.parse(data);
    res.json(obj);
});

apiRouter.get('/proofs', async(req,res,next) => {
    console.log('proofs call registered');
    const data:any = await readFile('mock/proofs.json');
    console.log(data);
    const obj = JSON.parse(data);
    res.json(obj);
});

const readFile = async(filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(dir,filePath),'utf8', (err,data) => {
            console.log('err:', err, 'data:',data);
            if(err){
    
            }else{
                resolve(data);
            }
        });
    })
  
}

export default apiRouter;