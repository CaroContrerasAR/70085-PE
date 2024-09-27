import ProductModel from '../models/products.model.js'

class ProductManager {
    
    async addProduct (product) {
        try {
            //esto lo valida el Schema, puede quedar como doble
            if(!product.title || !product.description || !product.code || !product.price || !product.img || !product.stock || !product.category ){
                return 'All fields are required'
            }
             
            const validateCode = await ProductModel.findOne({code: product.code})
            if(validateCode){
                return `Code ${product.code} already exists`
            }
    
            const newProducts = new ProductModel ({
                title:product.title,
                description:product.description,
                price:product.price,
                img:"no tiene",
                code:product.code,
                stock:product.stock,
                category:product.category,
                status: true,
                thumbnails:product.thumbnails
            })
            await newProducts.save()
            // return 'product added successfully'      
            
        } catch (error) {
            console.log('Error adding product');
            throw error
        }
    }
    //SIN Paginate
    // async getProducts () {
    //     try {
    //         return await ProductModel.find().lean()
    //     } catch (error) {
    //         console.log('Error getting products ')
    //         throw error
    //     }
    // }
    async getProducts ({ page = 1, limit = 10, sort = 1, query}={}) {
        try {
            // Añade verificación de parámetros
            if (typeof page !== 'number' || typeof limit !== 'number' || page <= 0 || limit <= 0) {
            throw new Error('Invalid parameters');
        }
            const skip = (page - 1) * limit
            let filter={ }
            let sortOption={ }
            if(query){
                filter.category = query
            }
            if(sort){
                if( sort === 'asc' || sort === 'desc' ) {
                    sortOption.price = sort === 'asc' ? 1 : -1
                }
            }
            const product=await ProductModel
                .find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean()
                const totalProducts=await ProductModel.countDocuments(filter)
                const totalPages=Math.ceil(totalProducts/limit)
                const hasPrevPage = page>1
                const hasNextPage = page<totalPages
                
                return {
                    docs: product,
                    totalPages,
                    prevPage: hasPrevPage ? page - 1 : null,
                    nextPage: hasNextPage ? page + 1 : null,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                    nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
                };
        } catch (error) {
            throw new Error ('Error getting products: ' + error.message)
        }
    }

    async getProductById(id) {
        try {
            const productById = await ProductModel.findById(id)
            if(!productById){
                //console.log('Product not found')
                return null
            }
            return productById
            
        } catch (error) {
            console.log('Error finding products by Id ')
            throw error
        }
    }

    async updateProducts (id, updatedProduct) {
        try {
            const productById = await ProductModel.findByIdAndUpdate(id, updatedProduct)
            if(!productById){
                console.log('Product not found');
                return null
            } 
            console.log('Product Updated successfully');
            return productById
        } catch (error) {
            console.log('Error updating products')
            throw error
        }
    }
   
    async deleteProducts(id) {
        try {
            let products = await ProductModel.findByIdAndDelete(id)
            if(!products){
                //console.log('Product not found');
                return null
            }
            //console.log('Product deleted successfully');
            return products
        } catch (error) {
            console.log('error deleting products ')
            throw error
        }
    }
}

export default ProductManager