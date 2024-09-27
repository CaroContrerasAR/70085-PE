import CartModel from '../models/carts.model.js'

export class CartManager {
    async createCarts() {
        try {
            const newCarts = new CartModel({products: []})
            await newCarts.save()
            return newCarts               
        } catch (error) {
            throw new Error ('Error creating carts')
        }
    }

    async getCartsById (id) {
        try {
           const findCarts = await CartModel.findById(id) 
           if(!findCarts){
             throw new Error ('Cart Id not found')
           }
           return findCarts
        } catch (error) {
            throw new Error('Error to finding Id')
        }
    }

    async addProductInCart(cartId, productId, quantity=1) {
        try {
            const cartsById = await this.getCartsById(cartId);
            const existProduct = cartsById.products.find(p => p.product.toString() === productId);
            if (existProduct) {
                existProduct.quantity += quantity
            } else {
                cartsById.products.push({ product: productId, quantity})
            }
            //vamos a marcar la propiedad products como modificada antes de guardar
            cartsById.markModified('products')
            await cartsById.save()
            return cartsById
        } catch (error) {
            throw new Error ('Error adding products in cart')
        }
    }
    async deleteProducts(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId)
            if(!cart){
                throw new Error('Cart not found')
            }
            const initialLength = cart.products.length;
            cart.products = cart.products.filter( p => p.product._id.toString() !== productId )
            if (cart.products.length !== initialLength) {
            await cart.save()
            return cart
            }else {
                throw new Error('Product not found in cart')
            }
        } catch (error) {
            throw new Error ('error deleting products in cart')
        }
    }
    async updateCart (id, updatedCart) {
        try {
            const cartsById = await CartModel.findById(id)
            if(!cartsById){
                throw new Error('Cart not found')
            } 
            cartsById.products = updatedCart
            cartsById.markModified('products')
            await cartsById.save()
            return cartsById                       
        } catch (error) {
            throw new Error('Error updating carts')
        }
    }
    async updateQttyCart (idCart, idProduct, qtty) {
        try {
            const cart = await CartModel.findById(idCart)
            if(!cart){
                throw new Error('Cart not found')
            } 
            const prodIndex = cart.products.findIndex(item=>item._id.toString()===idProduct)
            if(prodIndex !== -1){
                cart.products[prodIndex].quantity = qtty
                cart.markModified('products')
                await cart.save()
                return cart          
            } else {
                throw new Error('Product not found in cart')
            }             
        } catch (error) {
            throw new Error('Error updating quantity in carts')
        }
    }
    async emptyCarts(cartId) {
        try {
            const cart = await CartModel.findById(cartId)
            if(!cart){
                throw new Error('Cart not found')
            }
            cart.products = []
            await cart.save()
            return cart                
        } catch (error) {
            throw new Error ('error emptying the cart')
        }
    }   
}
export default CartManager