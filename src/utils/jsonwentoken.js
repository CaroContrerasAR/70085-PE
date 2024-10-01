import jwt from 'jsonwebtoken'
const private_key = 'palabrasecretaparatoken'

const generateToken = (user)=>{
    const token = jwt.sign(user, private_key, {expiresIn:'24h'})
    return token
    console.log(token);
    
}

export default generateToken