import passport from 'passport'
import local from 'passport-local'
import UserModel from '../dao/models/users.model.js'
//import UserModel from '../models/usuario.model.js'
import { createHash, isValidPassword } from '../utils/util.js'

const LocalStrategy = local.Strategy

const initializePassport = () =>{
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
    }, async( req, username, password, done ) =>{
        const {first_name, last_name, email, age} = req.body
        try {
            let user = await UserModel.findOne({email: email})
            if(user){
                return done( null, false )
            }
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            let result = await UserModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done('Error getting user: ', error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(email, password, done)=>{
        try {
            //verifico que existe el usuario
            const user = await UserModel.findOne({email})
            if(!user){
                return done(null, false)
            }
            //si existe el usuario, verifico contraseña
            if(!isValidPassword(password, user)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done('Error logging user: ', error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user = await UserModel.findById({_id: id})
        done(null, user)
    })
}

export default initializePassport