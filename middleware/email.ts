import dotenv from 'dotenv';
dotenv.config();

const api = process.env.api_sim;
if(!api){
    console.error('missing api');
    process.exit(1);
};
