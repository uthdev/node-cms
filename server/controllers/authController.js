import bcrypt from 'bcryptjs';
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
      return res.redirect('/login');
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
}

export default AuthControllers;