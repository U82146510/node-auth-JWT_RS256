import { Router } from "express";
import {admin_route} from '../controllers/admin.ts';

export const admin:Router = Router();
admin.get('/',admin_route);