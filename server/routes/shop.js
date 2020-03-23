import { Router } from 'express';
import ProductController from '../controllers/shopController';
import isAuth from '../middlewares/authenticate';

const {
  getProducts, getProductDetails, getIndex, postCart,
  postCartDeleteProduct, getCart, getOrders, postOrder
} = ProductController;

const shopRoutes = Router();

shopRoutes.get('/', getIndex);

shopRoutes.get('/products', getProducts);

shopRoutes.get('/products/:productId', getProductDetails);

shopRoutes.post('/cart', isAuth, postCart);

shopRoutes.get('/cart', isAuth, getCart);

shopRoutes.post('/cart-delete-item', isAuth, postCartDeleteProduct);

shopRoutes.get('/orders', isAuth, getOrders);

shopRoutes.post('/create-order', isAuth, postOrder);


export default shopRoutes;
