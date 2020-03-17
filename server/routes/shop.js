import { Router } from 'express';
import ProductController from '../controllers/shopController';

const {
  getProducts, getProductDetails, getIndex, postCart,
  postCartDeleteProduct, getCart, getOrders, postOrder
} = ProductController;

const shopRoutes = Router();

shopRoutes.get('/', getIndex);

shopRoutes.get('/products', getProducts);

shopRoutes.get('/products/:productId', getProductDetails);

shopRoutes.post('/cart', postCart);

shopRoutes.get('/cart', getCart);

shopRoutes.post('/cart-delete-item', postCartDeleteProduct);

shopRoutes.get('/orders', getOrders);

shopRoutes.post('/create-order', postOrder);


export default shopRoutes;
