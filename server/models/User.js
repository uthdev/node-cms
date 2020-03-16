import { ObjectId } from 'mongodb';
import { db } from '../index';

class User {
  constructor (name, email, id, cart) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.cart = cart;
  }

  async save() {
    try {
      const result = await db.collection('users').insertOne(this);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addToCart (product) {
    const cartProductIndex = this.cart.items.findIndex(item => item.productId.toString() == product._id.toString());

    let newQuantity = 1;
    const updatedCartItem = [...this.cart.items];
    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItem[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItem.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }
    const updatedCart = { items: updatedCartItem }
    try {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async getCart () {
    const productIds = this.cart.items.map(item => item.productId);

    try {
      const products = await db.collection('products').find(
        { _id: { $in: productIds } }
        ).toArray();
      const cartProducts = products.map(product => {
        return {
          ...product, 
          quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity
        }
      });
      return cartProducts;
    } catch (error) {
      return error;
    }
  }

  async deleteCartItem (productId) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    try {
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addOrder () {
    try {
      const cartProducts = await this.getCart();
      const order = {
        items: cartProducts,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      }
      const result = await db.collection('orders').insertOne(order);
      this.cart = { items: [] };
      await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: [] } } }
      );
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getOrders() {
    try {
      const result = await db.collection('orders').find(
        { 'user._id': new ObjectId(this._id) }
        ).toArray();
        console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async findById (userId) {
    try {
      const result =  await db.collection('users').findOne({ _id: new ObjectId(userId) });
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }  
}

export default User;