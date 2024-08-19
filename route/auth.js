import express from 'express';
import { getSession, postLogin, postLogout, postRegist } from '../controller/mongodb-auth-controller.js';

const router = express.Router();

router.get('/session', getSession);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/regist', postRegist);

export default router;