import { Router } from 'express';
import ProductController from '../controllers/adminController';
import isAuth from '../middlewares/authenticate';

const adminRoutes = Router();
const {
  getAddProduct, postAddProduct, getEditProduct, postEditProduct, getProducts, postDeleteProduct
} = ProductController;

adminRoutes.get('/add-product', isAuth, getAddProduct);

adminRoutes.get('/products', isAuth, getProducts);

adminRoutes.post('/add-product', isAuth, postAddProduct);

adminRoutes.get('/edit-product/:productId', isAuth, getEditProduct);

adminRoutes.post('/edit-product', isAuth, postEditProduct);

adminRoutes.post('/delete-product', isAuth, postDeleteProduct);

export default adminRoutes;
