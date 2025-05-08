import { type Request,type Response,type NextFunction } from "express";
import Joi from "joi";
import {User} from '../model/User.ts';


interface SignupType{
    email:string;
    password:string;
}

const signup = Joi.object<SignupType>({
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required()
})

function signup_assert(arg:unknown):asserts arg is SignupType{
    if(typeof arg !== 'object' || arg === null
        || !('email' in arg) || !('password' in arg) ||
        typeof (arg as any).password !== 'string' ||
        typeof (arg as any).email !== 'string'
    ){
        throw new Error('Invalud signup_type')
    }
};

export const user_signup = async(req:Request,res:Response,next:NextFunction)=>{
    const {value,error} = signup.validate(req.body);
    if(error){
        res.status(400).json({message:error.message});
        return;
    }
    signup_assert(value);
    try {
        const existingUser = await User.findOne({email:value.email});
        if(existingUser){
            res.status(409).json({message:'This username already exists.'});
            return;
        }
        const user = await User.create({email:value.email,password:value.password});
        res.status(201).json({message:'Sign up successful',id:user._id});
    } catch (error) {
        next(error);
    }
};