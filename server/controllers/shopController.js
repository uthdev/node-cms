import Product from '../models/productModel';
import Cart from '../models/cartModel';

class ProductController {
  static async getProducts(req, res) {
    Product.fetchAll((products) => {
      res.render('shop/product-list', {
        pageTitle: 'All Products', 
        products, 
        path: '/products'
      });
    });
  }

  static async getProductDetails (req, res) {
    const { productId } = req.params;
    Product.findById(productId, product => {
      if(!product) {
        return res.redirect('/');
      }
      res.render('shop/product-detail', {
        pageTitle: product.title,
        product,
        path: '/products'
      })
    })

  }

  static async getIndex(req, res) {
    Product.fetchAll((products) => {
      res.render('shop/index', {
        pageTitle: 'Shop', 
        products, 
        path: '/'
      });
    });
  }

  

  static async getCheckout(req, res) {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout'
    })
  }

  static async postCart (req, res) {
    const { productId } = req.body;
    Product.findById(productId, product => {
      Cart.addProduct(productId, product.price);
    })
    res.redirect('/cart');
  }

  static async postCartDeleteProduct (req, res) {
    const { productId } = req.body;
    Product.findById(productId, product => {
      Cart.deleteProduct(productId, product.price);
      res.redirect('/cart')
    })
  }

  static async getCart (req, res) {
    Cart.getCart(cart => {
      Product.fetchAll(products => {
        const cartProducts = [];
        for(let product of products) {
          const cartProductData = cart.products.find(prod => prod.id === product.id);
          if(cartProductData){
            cartProducts.push({productData: product, qty: cartProductData.qty})
          }
        }
        res.render('shop/cart', {
          products: cartProducts,
          path: '/cart',
          pageTitle: 'Your Cart'
        })
      })  
    }) 
  } 

  static async getOrders (req, res) {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders'
    })
  }
}

export default ProductController;