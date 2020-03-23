import Product from '../models/Product';

class AdminController {
  static async getAddProduct(req, res) {
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
    });
  }


  static async postAddProduct(req, res, next) {
    const { user: userId } = req;
    try {
      const {
        title, imageUrl, price, description, 
      } = req.body;
      const product = new Product({
        title, description, price, imageUrl, userId
      });
      await product.save();
      console.log('Created Product');
      res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }

  static async getEditProduct(req, res, next) {
    const { params: { productId }, query: { edit } } = req;
    if (!edit) {
      return res.redirect('/');
    }
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.redirect('/');
      }
      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit,
        product,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async postEditProduct(req, res, next) {
    const {
      productId, title, imageUrl, price, description
    } = req.body;
    try {
      const product = await Product.findById(productId);
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      product.save();
      console.log('Updated Product!');
      return res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const products = await Product.find();
      // .select('title price -_id')
      // .populate('userId', 'name');
      console.log(products);
      return res.render('admin/products', {
        pageTitle: 'Admin Products',
        products,
        path: '/admin/products',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async postDeleteProduct(req, res, next) {
    const { productId } = req.body;
    try {
      await Product.findByIdAndRemove(productId);
      console.log('Destroyed Product');
      return res.redirect('/admin/products');
    } catch (error) {
      return next(error);
    }
  }
}

export default AdminController;
