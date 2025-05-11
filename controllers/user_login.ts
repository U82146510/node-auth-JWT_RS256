import { type Request,type Response,type NextFunction } from "express";
import Joi from "joi";
import { User } from "../model/User.ts";
import {jwtService} from '../auth/jwt_service.ts';

interface LoginType{
    email:string;
    password:string;
}

const loginSchema = Joi.object<LoginType>({
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required()
})

function login_assert(arg:unknown):asserts arg is LoginType{
    if(typeof arg !== 'object' || arg === null
        || !('email' in arg) || !('password' in arg) ||
        typeof (arg as any).password !== 'string' ||
        typeof (arg as any).email !== 'string'
    ){
        throw new Error('Invalud signup_type')
    }
};

export const user_login = async (req:Request,res:Response,next:NextFunction)=>{
    const {value,error} = loginSchema.validate(req.body);
    if(error){
        res.status(400).json({message:error.message})
        return;
    }
    login_assert(value);
    try {
        const user = await User.findOne({email:value.email});
        if(!user ||!user.verify_password(value.password)){
           res.status(401).json({message:'Invalid user or password'});
           return; 
        }
        res.status(200).json({message:"logged in successfully"});
    } catch (error) {
        next(error);
    }
};