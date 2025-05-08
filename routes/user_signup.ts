import { Router } from "express";
import {user_signup} from '../controllers/user_signup.ts';

export const signup:Router = Router();

signup.post('/',user_signup);