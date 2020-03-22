import Product from '../models/Product';
import Order from '../models/Order';

class ProductController {
  static async getProducts(req, res, next) {
    try {
      const products = await Product.find();
      console.log(products);
      return res.render('shop/product-list', {
        pageTitle: 'All Products',
        products,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getProductDetails(req, res, next) {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);
      console.log(product);
      if (!product) {
        return res.redirect('/');
      }
      return res.render('shop/product-detail', {
        pageTitle: product.title,
        product,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getIndex(req, res) {
    try {
      const products = await Product.find();
      return res.render('shop/index', {
        pageTitle: 'Shop',
        products,
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    } catch (error) {
      return next(error);
    }
  }
  
  static async postCart(req, res, next) {
    const { body: { productId }, user } = req;
    try {
      const product = await Product.findById(productId);
      const result = await user.addToCart(product);
      console.log(result);
      return res.redirect('/cart');
    } catch (error) {
      return next(error);
    }
  }

  static async postCartDeleteProduct(req, res) {
    const { body: { productId }, user } = req;
    try {
      await user.deleteCartItem(productId);
      return res.redirect('/cart');
    } catch (error) {
      return next(error);
    }
  }

  static async getCart(req, res, next) {
    const { user } = req;
    try {
      const { cart: { items } } = await user.populate('cart.items.productId').execPopulate();
      console.log(items);
      return res.render('shop/cart', {
        products: items,
        path: '/cart',
        pageTitle: 'Your Cart',
        isAuthenticated: req.session.isLoggedIn
      });
    } catch (error) {
      return next(error);
    }
  }

  static async postOrder(req, res, next) {
    const { user } = req;
    try {
      const { cart: { items } } = await user.populate('cart.items.productId')
        .execPopulate();
      const products = items.map((item) => ({ quantity: item.quantity, product: { ...item.productId._doc } }));
      const order = new Order({
        products,
        user: {
          name: user.name,
          userId: user
        }
      });
      await order.save();
      await user.clearCart();
      return res.redirect('/orders');
    } catch (error) {
      return next(error);
    }
  }

  static async getOrders(req, res, next) {
    const { user } = req;
    try {
      const orders = await Order.find({ 'user.userId': user._id });
      return res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isLoggedIn
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductController;
