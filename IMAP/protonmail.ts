import dotnev from 'dotenv';
dotnev.config();
import {ImapFlow} from 'imapflow';


const user = process.env.user;
const pass = process.env.pass;
if(!user||!pass){
    throw new Error('missing user or pass');
};


export const client = new ImapFlow({
    host:'imap.gmail.com',
    port:993,
    secure:true,
    auth:{
        user:user,
        pass:pass
    }
});