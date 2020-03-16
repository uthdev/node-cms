import Product from '../models/Product';

class ProductController {
  static async getProducts(req, res, next) {
    try {
      const products = await Product.fetchAll();
      console.log(products);
      return res.render('shop/product-list', {
        pageTitle: 'All Products', 
        products, 
        path: '/products'
      });
    } catch {
      return next(error);
    }
  }

  static async getProductDetails (req, res, next) {
    const { productId } = req.params;
    console.log(productId);
    try {
      const product = await Product.findById(productId);
      console.log(product);
      if(!product) {
        return res.redirect('/');
      }
      return res.render('shop/product-detail', {
        pageTitle: product.title,
        product,
        path: '/products'
      })
    } catch (error) {
      return next(error);
    }
  }

  static async getIndex(req, res) {
    try {
      const products = await Product.fetchAll();
      return res.render('shop/index', {
        pageTitle: 'Shop', 
        products, 
        path: '/'
      });
    } catch {
      return next(error);
    }
  }

  

  static async getCheckout(req, res) {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout'
    })
  }

  static async postCart (req, res, next) {
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

  static async postCartDeleteProduct (req, res) {
    const { body: { productId }, user } = req;
    try {
      await user.deleteCartItem(productId);
      return res.redirect('/cart')
    } catch (error) {
      return next(error);
    }
  }

  static async getCart (req, res, next) {
    const { user } = req;
    try {
      const cartProducts = await user.getCart();
      return  res.render('shop/cart', {
        products: cartProducts,
        path: '/cart',
        pageTitle: 'Your Cart'
      });
    } catch (error) {
      return next(error);
    }
       
  } 

  static async postOrder (req, res, next) {
    const { user } = req;
    try {
      await user.addOrder();
      return res.redirect('/orders');
    } catch (error) {
      return next(error)
    }

  }

  static async getOrders (req, res, next) {
    const { user } = req;
    try {
      const orders = await user.getOrders();
      console.log(orders);
      return res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    } catch (error) {
      return next(error);
    }    
  }
}

export default ProductController;