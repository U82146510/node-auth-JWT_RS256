import mongoose from "mongoose";
import dotenv from 'dotenv';
import { Err } from "joi";
dotenv.config();

const atlas = process.env.atlas;
if(!atlas){
    throw new Error("missing atlas connection string");
}

export const connect_to_atlas = async()=>{
    try {
        await mongoose.connect(atlas,{
            serverSelectionTimeoutMS:10000,
            socketTimeoutMS:45000,
            maxPoolSize:10
        })
    } catch (error) {
        console.error(error);
    }
};

const db:mongoose.Connection=mongoose.connection;

db.on('error',(error:Error)=>{
    console.error(error);
});
db.on('connected',()=>{
    console.log('connected to atlas');
});
db.on('disconnected',()=>{
    console.log('disconnected from atlas');
});
db.on('reconnected',()=>()=>{
    console.log('reconnected to atlas');
})