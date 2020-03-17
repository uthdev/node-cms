import { Router } from 'express';
import ProductController from '../controllers/adminController';

const adminRoutes = Router();
const {
  getAddProduct, postAddProduct, getEditProduct, postEditProduct, getProducts, postDeleteProduct
} = ProductController;

adminRoutes.get('/add-product', getAddProduct);

adminRoutes.get('/products', getProducts);

adminRoutes.post('/add-product', postAddProduct);

adminRoutes.get('/edit-product/:productId', getEditProduct);

adminRoutes.post('/edit-product', postEditProduct);

adminRoutes.post('/delete-product', postDeleteProduct);

export default adminRoutes;
