import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
// import expressHbs from 'express-handlebars';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import get404 from './controllers/errorController';
import User from './models/User';

const app = express();

app.set('view engine', 'ejs');
// app.engine('hbs', expressHbs({
// layoutsDir: 'views/layouts/', defaultLayout: 'main', extname: 'hbs'
// }));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
// app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
const PORT = process.env.PORT || 3000;

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e7088283be41b0e584a1121');
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/*', get404);

app.listen(PORT, async () => {
  const result = await mongoose.connect('mongodb+srv://uthdev_92:2VTSlV3uHROn2Bnu@cluster0-aqv1h.mongodb.net/development?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(result);
  console.log('connected to database with moongoose');
  const userExists = await User.findOne();
  if (!userExists) {
    const user = new User({
      name: 'Uthdev',
      email: 'adelekegbolahan92@gmail.com',
      cart: {
        items: []
      }
    });
    await user.save();
  }
  console.log(`Server started on port ${PORT}`);
});

export default app;
