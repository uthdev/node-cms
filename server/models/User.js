import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = async function (product) {
  const cartProductIndex = this.cart.items.findIndex((item) => item.productId.toString() === product._id.toString());

  let newQuantity = 1;
  const updatedCartItem = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItem[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItem.push({ productId: product._id, quantity: newQuantity });
  }
  const updatedCart = { items: updatedCartItem };
  this.cart = updatedCart;
  try {
    const result = await this.save();
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.deleteCartItem = async function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString());
  this.cart.items = updatedCartItems;
  try {
    const result = await this.save();
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.clearCart = async function () {
  this.cart = { items: [] };
  try {
    const result = await this.save();
    return result;
  } catch (error) {
    return error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
