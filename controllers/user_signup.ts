import { type Request,type Response,type NextFunction } from "express";
import Joi from "joi";

const signup = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})

const user_signup = (req:Request,res:Response,next:NextFunction)=>{
    const {value,error} = signup.validate(req.body);
    if(error){
        res.status(400).json({message:error.message});
        return;
    }
    try {
        
    } catch (error) {
        next(error);
    }
}