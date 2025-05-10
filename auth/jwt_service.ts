import jwt from 'jsonwebtoken';
import fs from 'fs';
import type {StringValue} from 'ms';

const JWT_CONFIG = {
    privateKeyPath:process.env.PRIVATE_KEY_PATH,
    publicKeyPath:process.env.PUBLIC_KEY_PATH,
    algorithm:'RS256' as const,
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE
};


if(!JWT_CONFIG.privateKeyPath||!JWT_CONFIG.publicKeyPath){
    throw new Error('Missing private/public key')
}


if(!fs.existsSync(JWT_CONFIG.privateKeyPath)){
    throw new Error(`Private key not found at path ${JWT_CONFIG.privateKeyPath}`);
}
if(!fs.existsSync(JWT_CONFIG.publicKeyPath)){
    throw new Error(`Public key not found at path ${JWT_CONFIG.publicKeyPath}`);
}

function loadKeyWithValidation(keyPath:string,requiredPermissions?:number){
    try {
        if(requiredPermissions && process.platform!=='win32'){
            const stats = fs.statSync(keyPath);
            const actualPermissions = stats.mode & 0o777;
            if(actualPermissions!==requiredPermissions){
                console.warn(`Warning: Key file ${keyPath} has permissions ${actualPermissions.toString(8)}, recommended ${requiredPermissions.toString(8)}`);
            }
        }
        return fs.readFileSync(keyPath,'utf8');
    } catch (error) {
        throw new Error(`Faild to load keys from ${keyPath}: ${
            error instanceof Error ? error.message : String(error)
        }`);
    }
}

const privateKey = loadKeyWithValidation(JWT_CONFIG.privateKeyPath,0o400);
const publicKey = loadKeyWithValidation(JWT_CONFIG.publicKeyPath,0o444); 

interface JwtPyload{
    id:string,
    role:'admin'|'user',
};


export class jwtService {
    private static verifyOptions: jwt.VerifyOptions = {
        algorithms:[JWT_CONFIG.algorithm],
        issuer:JWT_CONFIG.issuer,
        audience:JWT_CONFIG.audience
    };
    private static signOptions:jwt.SignOptions = {
        algorithm:JWT_CONFIG.algorithm,
        expiresIn:JWT_CONFIG.expiresIn as StringValue,
        issuer:JWT_CONFIG.issuer,
        audience:JWT_CONFIG.audience,
    };

    static sign(payload:payload):string{
        try {
            const token = jwt.sign(payload,privateKey,{
                algorithm:'RS256',
                expiresIn:'1h',
                issuer:'node app',
                audience:'postman'
            });
            return token;
        } catch (error) {
            throw new Error('Error at signing jwt token');
        }
    };

    static verify(token:string):payload{
        try {
            const decoded = jwt.verify(token,publicKey,{
                algorithms:['RS256'],
                issuer:'node app',
                audience:'postman'})
            return decoded as payload;
        } catch (error) {
            throw new Error('Error at verify jwt token');
        }
    };
    
    static refresh(token:string):string{
        try {
            const payload = jwt.verify(token,publicKey,{
                algorithms:['RS256'],
                issuer:'node app',
                audience:'postman'
            });
            const token_refresh = jwt.sign(payload,privateKey,{
                algorithm:'RS256',
                expiresIn:'1h',
                issuer:'node app',
                audience:'postman'
            });
            return token_refresh;
        } catch (error) {
            throw new Error('Error at refresh token')
        }
    };
};
