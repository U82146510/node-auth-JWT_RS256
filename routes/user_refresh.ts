import { Router } from "express";
import {user_refresh} from '../controllers/user_refresh.ts';

export const refresh:Router = Router();

refresh.post('/',user_refresh);