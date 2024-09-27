import {promises as fs} from 'fs'
import {nanoid} from 'nanoid'

class ProductManager {
    constructor(){
        this.products=[];
        this.path='./src/dao/fs/data/products.json'; 
    }
    
    async readProducts( ) {
        try { 
            const response = await fs.readFile(this.path, "utf-8");
            const responseJSON = JSON.parse(response)
            return responseJSON
        } catch (error) {
            console.error('error reading products ', error)            
            return []
        }
    }
    
    async writeProducts (products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (err) {
            console.err('error writing products ', err)            
        }
    }

    async exist (id) {
        const products = await this.readProducts()
        return products.find(prod => prod.id === id)
    }

    async addProduct (product) {
        const id = nanoid()
        //if(!product.title||!product.description||!product.code||!product.price||!product.status||!product.stock||!product.category){
        if(!product.title||!product.description||!product.code||!product.price||!product.stock||!product.category){
            return 'All fields are required'
        }

        let productsOld = await this.readProducts()
        const validateCode = productsOld.find(e=>e.code===product.code)
        if(validateCode){
            return `Code ${product.code} already exists`
        }
        product.id = id
        //product.price = parseFloat(product.price)
        //product.stock = parseInt(product.stock,10)

        let productsAll = [...productsOld, product]
        await this.writeProducts(productsAll)
        // return 'product added successfully'      
    }
    
    async getProducts () {
        try {
            return await this.readProducts();
        } catch (err) {
            console.err('error getting products ', err)
        }
    }

    async getProductById(id) {
        const productById = await this.exist(id)
        if(!productById){
            return 'Product not found'
        }
        return productById
    }

    async updateProducts (id, updatedProduct) {
        try {
            const productById = await this.exist(id)
            if(!productById) return 'Product not found'
            await this.deleteProducts(id)
            const productsOld = await this.readProducts()
            const products = [{...updatedProduct, id:id}, ...productsOld]
            await this.writeProducts(products)
            return  'Product Updated successfully'
        } catch (err) {
            console.err('error updating products ', err)
        }
    }
   
    async deleteProducts(id) {
        try {
            let products = await this.readProducts()
            let productIndex = products.findIndex(p=>p.id===id)
            if(productIndex !== -1){
                products.splice(productIndex, 1)
                await this.writeProducts(products)
                return 'Product deleted successfully'
            } else {
                return 'Product not found'
            }
        } catch (err) {
            console.err('error deleting products ', err)
        }
    }
}

export default ProductManager