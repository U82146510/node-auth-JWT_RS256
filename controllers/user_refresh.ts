import { type Request,type Response,type NextFunction } from "express";
import {jwtService} from '../auth/jwt_service.ts';

export const user_refresh = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.refreshToken;
    if(!token){
        res.status(400).json({message:'Invalid refresh token'});
        return;
    }
    try {
        const {tokenAccess,tokenRefresh} = jwtService.refresh(token);
        res.cookie('refreshToken',tokenRefresh,{
            httpOnly:true,
            secure:false,
            sameSite:'strict',
            maxAge:7 * 24 * 60 * 60 * 1000,
            path:'/auth/refresh',
        });
        res.status(200).json({tokenAccess});
    } catch (error) {
        next(error);
    }
};