import express,{type Application} from 'express';
import {error_handler} from './error/error_handler.ts';
import {signup} from './routes/user_signup.ts';
import {login} from './routes/user_login.ts';

const app:Application = express();
app.use(express.json());
const port:number = 3000;

app.use('/login',login);
app.use('/signup',signup);


app.use(error_handler);
const start =async()=>{
    try {
        app.listen(3000,()=>console.log('Server On'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();