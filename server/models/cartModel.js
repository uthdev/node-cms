import fs from 'fs';
import path from 'path';

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

class Cart {
  static async addProduct(id, productPrice) {
    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = {products: [], totalPrice: 0}
      if(!err) {
        cart = JSON.parse(fileContent)
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if(existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.qty += 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {id, qty: 1}
        cart.products.push(updatedProduct);
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
    })
    //Add new product /increase quatity
  }

  static async deleteProduct (id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if(err) {
        return;
      }
      const cart = JSON.parse(fileContent);
      const productIndex = cart.products.findIndex(product => product.id === id);
      const product = cart.products[productIndex];
      if(!product) {
        return;
      }
      cart.totalPrice = cart.totalPrice - (+productPrice * product.qty);
      cart.products.splice(productIndex, 1);
      fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
    })
  }

  static async getCart (cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if(err) {
        cb(null)
      }
      cb(cart);
    })
  }
}

export default Cart;