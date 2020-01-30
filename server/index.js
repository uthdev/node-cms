import path from 'path';
import express from 'express';
// import expressHbs from 'express-handlebars';
import rootDir from './utils/path';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404 } from './controllers/errorController';

const app = express();

app.set('view engine', 'ejs');
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main', extname: 'hbs'}));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
// app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')))
const PORT = process.env.PORT || 3000;

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/*', get404);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;


