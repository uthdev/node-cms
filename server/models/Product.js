import { ObjectId } from 'mongodb';
import { db } from '../index';

class Product {
  constructor(title, description, price, imageUrl, id, userId) {
    this._id = id ? new ObjectId(id) : null;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  async save () {
    let result;
    try {
      if(this._id) {
        result = await db.collection('products').updateOne({ _id: this._id }, { $set: this })
      } else {
       result  = await db.collection('products').insertOne(this);
      }
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async fetchAll () {
    try {
      const result = await db.collection('products').find().toArray();
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async findById (productId) {
    try {
      const result =  await db.collection('products').findOne({ _id: new ObjectId(productId) });
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async deleteById (productId) {
    console.log(productId)
    try {
      const result = await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
      console.log(result);
      return result
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default Product;





// import fs from 'fs';
// import path from 'path';
// import Cart from './cartModel';

// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

// const getProductsFromFile = cb => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// export default class Product {
//   constructor (id, title, imageUrl, price, description) {
//     this.id = id;
//     this.title = title;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.price = price;
//   }

//   async save () {
//     getProductsFromFile(products => {
//       if(this.id) {
//         const existingProductIndex = products.findIndex(product => product.id === this.id);
//         products[existingProductIndex] = this;
//         fs.writeFile(p, JSON.stringify(products), err => {
//           console.log(err);
//         });
//       } else {
//         this.id = (products.length + 1).toString();
//         products.push(this);
//         fs.writeFile(p, JSON.stringify(products), err => {
//           console.log(err);
//         });
//       }
//     });
//   }

//   static async fetchAll (cb) {
//     getProductsFromFile(cb);
//   }

//   static async findById (id, cb) {
//     getProductsFromFile(products => {
//       const product = products.find(item => item.id === id);
//       cb(product);
//     })
//   }

//   static async delete (id) {
//     getProductsFromFile(products => {
//       const product = products.find(product => product.id === id);
//       console.log(product);
//       const updatedProducts = products.filter(product => product.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         if(!err) {
//           Cart.deleteProduct(id, product.price);
//         }
//       });
//     })
//   }
// }