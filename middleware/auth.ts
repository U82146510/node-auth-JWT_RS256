import {type NextFunction, type Request,type Response} from 'express';
import { jwtService,type JwtPayload} from '../auth/jwt_service.ts';

export const auth = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message:'Unauthorized'});
        return;
    }
    try {
        const decode = jwtService.verify(token);
        req.user = decode as JwtPayload;
        next();
    } catch (error) {
        res.status(401).json({message:'Invalid token'})
    }
};