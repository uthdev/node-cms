import path from 'path';
import { Router } from 'express';
import rootDir from '../utils/path';
import ProductController from '../controllers/shopController';

const {getProducts, getProductDetails, getIndex, postCart, postCartDeleteProduct, getCart, getOrders, postOrder, getCheckout } = ProductController

const shopRoutes = Router();

shopRoutes.get('/', getIndex );

shopRoutes.get('/products', getProducts);

shopRoutes.get('/products/:productId', getProductDetails)

shopRoutes.post('/cart', postCart);

shopRoutes.get('/cart', getCart);

shopRoutes.post('/cart-delete-item', postCartDeleteProduct);

shopRoutes.get('/orders', getOrders);

shopRoutes.post('/create-order', postOrder)

shopRoutes.get('/checkout', getCheckout);

export default shopRoutes;