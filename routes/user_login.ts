import { Router } from "express";
import {user_login} from '../controllers/user_login.ts';

export const login:Router = Router();

login.post('/',user_login);