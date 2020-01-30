import Product from '../models/productModel';

class AdminController {
  static async getAddProduct(req, res) {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
  }


  static async postAddProduct(req, res) {
    const {title, imageUrl, price, description} = req.body;
    const product  = new Product(null, title, imageUrl, price, description);
    product.save();
    res.redirect('/admin/products');
  }

  static async getEditProduct(req, res) {
    const { params: { productId }, query: { edit }} = req;
    if(!edit) {
      return res.redirect('/');
    }
    Product.findById(productId, product => {
      if(!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit,
        product
      });
    }); 
  }

  static async postEditProduct(req, res) {
    const {productId, title, imageUrl, price, description} = req.body;
    const updatedProduct  = new Product(productId, title, imageUrl, price, description);
    updatedProduct.save();
    res.redirect('/admin/products');
  }

  static async getProducts(req, res) {
    Product.fetchAll((products) => {
      res.render('admin/products', {
        pageTitle: 'Admin Products', 
        products, 
        path: '/admin/products' , 
      });
    });
  }

  static async postDeleteProduct (req, res) {
    const { productId } = req.body;
    Product.delete(productId);
    res.redirect('/admin/products');
  }
}

export default AdminController;