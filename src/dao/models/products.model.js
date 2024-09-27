import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
mongoose.pluralize(null)
const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    img:{
        type: String        
    },
    stock: {
        type: Number, 
        required: true
    },  
    category:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        required: true
    },
    thumbnails:{
        type: [String]        
    },
})
productSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model('products', productSchema)
export default ProductModel