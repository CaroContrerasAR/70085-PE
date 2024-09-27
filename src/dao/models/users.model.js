import mongoose from 'mongoose'
mongoose.pluralize(null)
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        //required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,//(hash) con bcrypt usar el metodo hashSync
        //required: true
    },
    cart: {
            Id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
    },
    role: {
        type: String //default:'user'
    }
})
const UserModel = mongoose.model('users', userSchema)
export default UserModel