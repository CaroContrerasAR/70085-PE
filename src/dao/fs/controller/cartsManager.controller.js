import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './productsManager.controller.js'

const productsAll = new  ProductManager ()

export class CartManager {

    constructor() {
        this.path = './src/dao/fs/data/carts.json';
        this.carts = [];
        
        this.readCarts()
    }

    async readCarts() {
        try {
            let data = await fs.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            return
        } catch (error) {
            console.log('error reading carts');
            await this.writeCarts()
        }
    };
    
    async writeCarts() {
        try{
            await fs.writeFile(this.path,JSON.stringify(this.carts, null,2))
        }catch (err) {
            console.error('err writing carts ', err)
        }
    }

    async createCarts() {
        const newCarts = {
            id: nanoid(),
            products: []
        }
        this.carts.push(newCarts)
        await this.writeCarts()
        return newCarts
    }

    async exist (id) {
        const carts = await this.readCarts()
        return carts.find(cart => cart.id === id)
    }

    async addCarts (cartId,productId) {
        const cartsOld = await this.readCarts();
        const id = nanoid()
        const cartsConcat = [ {id : id, products : []}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return 'carts added successfully'
    }

    async getCartsById (id) {
        try {
           const findCarts = this.carts.find(cart => cart.id === id) 
           if(!findCarts){
             throw new Error ('Cart Id not found')
           }
           return findCarts
        } catch (error) {
            console.log('Error to finding Id');
            throw error
        }
    }

    async addProductInCart(cartId, productId, quantity=1) {
        try {
            const cartsById = await this.getCartsById(cartId);
            const existProduct = cartsById.products.find(p => p.product === productId);
            if (existProduct) {
                existProduct.quantity += quantity
            } else {
                cartsById.products.push({ product: productId, quantity})
            }
            await this.writeCarts();
            return cartsById
        } catch (error) {
            console.log('Error adding products in cart');
            throw error
        }
    }   
}
export default CartManager