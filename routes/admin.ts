import { Router } from "express";
import {admin_route} from '../controllers/admin.ts';
import {auth} from '../middleware/auth.ts';
import {check_permission} from '../middleware/rbac.ts';

export const admin:Router = Router();
admin.get('/',auth,check_permission(),admin_route);