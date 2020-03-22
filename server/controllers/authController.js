import User from '../models/User';
class AuthControllers {
  
  static async getLogin(req, res) {
    // console.log(req.get('Cookie'));
    // const isloggedIn = req.get('Cookie').split(';')[2].trim().split('=')[1];
    console.log(req.session)
    return res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: false
    });
  }

  static async postLogin(req, res, next) {
    // res.setHeader('Set-Cookie', 'loggedIn=true')
    try {
      const user = await User.findById('5e7088283be41b0e584a1121');
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save();
      return res.redirect('/');
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  static async getSignup(req, res, next) {
    return res.render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      isAuthenticated: false
    });
  };

  static async postSignup(req, res, next) {

  };

  static async postLogout(req, res, next) {
    try {
      await req.session.destroy();
      return res.redirect('/');
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

export default AuthControllers;