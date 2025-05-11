import jwt from 'jsonwebtoken';
import fs from 'fs';
import type {StringValue} from 'ms';


const JWT_CONFIG = {
    privateKeyPath:process.env.PRIVATE_KEY_PATH,
    publicKeyPath:process.env.PUBLIC_KEY_PATH,
    algorithm:'RS256' as const,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    expireRefresh:process.env.JWT_REFRESH_EXPIRE_IN,
    issuer: process.env.JWT_ISSUER || 'node app',
    audience: process.env.JWT_AUDIENCE || 'postman',
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

function loadKey(keyPath:string,permission?:number):string{
    if(!fs.existsSync(keyPath)) throw new Error(`key missing at keypath: ${keyPath}`);
    if(permission && process.platform!=='win32'){
      const mode = fs.statSync(keyPath).mode & 0o777;
      if(mode!==permission){
          throw new Error(`Insecure key permissions`);
      }
    }
    return fs.readFileSync(keyPath,'utf8');
};

const privateKey = loadKey(JWT_CONFIG.privateKeyPath,0o400);
const publicKey = loadKey(JWT_CONFIG.publicKeyPath,0o444); 

interface JwtPyload{
    id:string,
    role:'admin'|'user',
    iat?:number,
    exp?:number,
};




export class jwtService {
    private static verifyOptions: jwt.VerifyOptions = {
        algorithms:[JWT_CONFIG.algorithm],
        issuer:JWT_CONFIG.issuer,
        audience:JWT_CONFIG.audience
    };

    static signToken(payload:JwtPyload):string{
        try {
            const token = jwt.sign(payload,privateKey,{
                algorithm:JWT_CONFIG.algorithm,
                expiresIn:JWT_CONFIG.expiresIn as StringValue,
                issuer:JWT_CONFIG.issuer,
                audience:JWT_CONFIG.audience,
            });
            return token;
        } catch (error) {
            throw new Error('Error at signing jwt token');
        }
    };

    static signRefreshToken(payload:Omit<JwtPyload,'iat'|'exp'>){
        try {
            const refresToken = jwt.sign(payload,privateKey,{
                algorithm:JWT_CONFIG.algorithm,
                expiresIn:JWT_CONFIG.expireRefresh as StringValue,
                issuer:JWT_CONFIG.issuer,
                audience:JWT_CONFIG.audience,
            });
            return refresToken;
        } catch (error) {
            throw new Error('Error at signing refresh jwt token');
        }   
    };

    static verify(token:string):JwtPyload{
        try {
            const decoded = jwt.verify(token,publicKey,this.verifyOptions)
            return decoded as JwtPyload;
        } catch (error) {
            throw new Error('Error at verify jwt token');
        }
    };
    
    static refresh(refreshToken:string):{tokenAccess:string,tokenRefresh:string}{
        try {
            const payload = jwt.verify(refreshToken,publicKey,{
                algorithms:[JWT_CONFIG.algorithm],
                issuer:JWT_CONFIG.issuer,
                audience:JWT_CONFIG.audience
            });

            const tokenAccess = jwt.sign(payload,privateKey,{
                algorithm:JWT_CONFIG.algorithm,
                expiresIn:JWT_CONFIG.expiresIn as StringValue,
                issuer:JWT_CONFIG.issuer,
                audience:JWT_CONFIG.audience,
            });

            const tokenRefresh = jwt.sign(payload,privateKey,{
                algorithm:JWT_CONFIG.algorithm,
                expiresIn:JWT_CONFIG.expireRefresh as StringValue,
                issuer:JWT_CONFIG.issuer,
                audience:JWT_CONFIG.audience,
            });
            return {tokenAccess , tokenRefresh};
        } catch (error) {
            throw new Error('Error at refresh token')
        }
    };
};