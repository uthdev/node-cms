import path from 'path';
import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongoSession from 'connect-mongodb-session';
import csrf from 'csurf';
import flash from 'connect-flash';
// import expressHbs from 'express-handlebars';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import get404 from './controllers/errorController';
import User from './models/User';

const app = express();
dotenv.config();
const MongoDBStore = connectMongoSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
// app.engine('hbs', expressHbs({
// layoutsDir: 'views/layouts/', defaultLayout: 'main', extname: 'hbs'
// }));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
// app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({ 
  secret: 'Just another', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);
app.use(flash());


const PORT = process.env.PORT || 3000;

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/*', get404);

app.listen(PORT, async () => {
  const result = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(result);
  console.log('connected to database with moongoose');
  console.log(`Server started on port ${PORT}`);
});

export default app;
