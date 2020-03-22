import { Router } from 'express';
import AuthControllers from '../controllers/authController';

const { getLogin, postLogin, postLogout, getSignup, postSignup } = AuthControllers;

const authRoutes = new Router();

authRoutes.get('/login', getLogin);

authRoutes.post('/login', postLogin);

authRoutes.get('/signup', getSignup);

authRoutes.post('/signup', postSignup);

authRoutes.post('/logout', postLogout)

export default authRoutes;