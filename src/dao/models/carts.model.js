import mongoose from 'mongoose'
mongoose.pluralize(null)
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref:'products',
        required: true,
        index: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
})
const CartModel = mongoose.model('carts', cartSchema)
export default CartModel