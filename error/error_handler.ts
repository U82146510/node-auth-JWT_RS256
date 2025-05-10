import { type Request,type Response,type NextFunction } from "express"

export const error_handler_max = (err:unknown,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof Error){
        res.status(500).json({message:err.message});
        return;
    }
    res.status(500).json({message:"Internal server error again again again"});
}