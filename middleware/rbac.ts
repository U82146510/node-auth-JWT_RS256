import {type Request,type Response,type NextFunction} from 'express';

export const check_permission = ()=>
    (req:Request,res:Response,next:NextFunction)=>{
        try {
            const user_role = req.user?.role;
            if(!user_role){
                res.status(401).json({message:'Authentication required'});
                return;
            }
            if('admin'!==user_role){
                res.status(401).json({message:'Unauthorized'});
                return;
            }
            next()
        } catch (error) {
            res.status(403).json({message:'Forbidden'});
        }
};