import { Router } from 'express';
import AuthControllers from '../controllers/authController';

const { 
  getLogin, postLogin, postLogout, 
  getSignup, postSignup, getForgot, 
  postForgot, getReset, postReset 
} = AuthControllers;

const authRoutes = new Router();

authRoutes.get('/login', getLogin);

authRoutes.post('/login', postLogin);

authRoutes.get('/signup', getSignup);

authRoutes.post('/signup', postSignup);

authRoutes.post('/logout', postLogout);

authRoutes.get('/forgotpassword', getForgot);

authRoutes.post('/forgotpassword', postForgot);

authRoutes.get('/resetpassword/:token', getReset);

authRoutes.post('/resetpassword', postReset);

export default authRoutes;