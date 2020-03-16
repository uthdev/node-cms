import path from 'path';
import express from 'express';
// import expressHbs from 'express-handlebars';
import rootDir from './utils/path';
import dbConnect from './utils/database';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404 } from './controllers/errorController';
import User from './models/User';

const app = express();

app.set('view engine', 'ejs');
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main', extname: 'hbs'}));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
// app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')))
const PORT = process.env.PORT || 3000;

app.use( async (req, res, next) => {
  try {
    const user = await User.findById("5e6cd7676205b50dd84c9413");
    const { name, email, _id, cart } = user
    req.user = new User(name, email, _id, cart);
    next();
  } catch (error) {
    return next(error);
  }
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/*', get404);

let db;
app.listen(PORT, async () => {
  db = await dbConnect();
  console.log(db);
  console.log(`Server started on port ${PORT}`)
});

export default app;
export { db };

