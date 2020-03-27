import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import User from '../models/User';


class AuthControllers {
  static async getLogin(req, res) {
    // console.log(req.get('Cookie'));
    // const isloggedIn = req.get('Cookie').split(';')[2].trim().split('=')[1];
    // console.log(req.session)
    return res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: req.flash('error')[0] || null, 
    });
  }

  static async postLogin(req, res, next) {
    // res.setHeader('Set-Cookie', 'loggedIn=true')
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }     
      const isMatched = bcrypt.compareSync(password, user.password);
      if (isMatched) {
        req.session.user = user
        req.session.isLoggedIn = true;
        await req.session.save();
        return res.redirect('/')
      }
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login')
    } catch (error) {
      console.log(error);
      return res.redirect('/login');
    }
  }

  static async getSignup(req, res, next) {
    return res.render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: req.flash('error')[0] || null, 
    });
  };

  static async postSignup(req, res, next) {
    const { email, password, confirmPassword} = req.body;
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
      const userExists = await User.findOne({email});
      if (userExists) {
        req.flash('error', 'Email exist already, please pick a different one.');
        return res.redirect('/signup');
      }
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
      const user = new User({ 
        email: email, 
        password: hashedPassword,
        cart: { items: [] }
      });
      await user.save();
      res.redirect('/login');
      const msg = {
        to: email,
        from: 'Shop@node-cms.com',
        subject: 'Signup Succeeded!',
        html: '<p>You successfully signed up!</p>'
      }
      return sgMail.send(msg); 
    } catch (error) {
      return res.redirect('/signup');
    }
  };

  static async postLogout(req, res, next) {
    try {
      await req.session.destroy();
      return res.redirect('/');
    } catch (error) {
      console.log(error);
      return res.redirect('/');
    }
  }

  static async  getForgot(req, res, next) {
    return res.render('auth/forgot', {
      pageTitle: 'Forgot Password',
      path: '/forgotpassword',
      errorMessage: req.flash('error')[0] || null, 
    });
  }

  static async postForgot(req, res, next) {
    const { email } = req.body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
      const buffer = crypto.randomBytes(32);
      const token = buffer.toString('hex');
      console.log(token);
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        req.flash('error', 'No Account with that email found.');
        return res.redirect('/forgotpassword');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      const msg = {
        to: email,
        from: 'Shop@node-cms.com',
        subject: 'Password Reset',
        html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href="http://localhost:3000/resetpassword/${token}">link</a> to set a new password</p>
        `
      }
      return sgMail.send(msg); 
    } catch (error) {
      console.log(error);
      return res.redirect('/forgotpassword')
    }
  }

  static async getReset (req, res, next) {
    const { token } = req.params;
    try {
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt:  Date.now()} });
      return res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/resetpassword',
        userId: user._id.toString(),
        passwordToken: token,
        errorMessage: req.flash('error')[0] || null, 
      });
    } catch (error) {
      console.log(error);
      return res.redirect('/forgotpassword');
    }
  }

  static async postReset (req, res, next) {
    const { password, userId, passwordToken } = req.body;
    try {
      const user = await User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: { $gt: Date.now() }, 
        _id: userId 
      });
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
      return res.redirect('/login')
    } catch (error) {
      console.log(error);
      return res.redirect('/resetpassword');
    }
  }
}

export default AuthControllers;