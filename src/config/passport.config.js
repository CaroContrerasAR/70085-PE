import passport from 'passport'
import local, { Strategy } from 'passport-local'
//Estrategia con Github
import GitHubStrategy from 'passport-github2'
//Estrategia con Google
import GoogleStrategy from 'passport-google-oauth20'
//Estrategia para JWT
import jwt from 'passport-jwt'
const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

import UserModel from '../dao/models/users.model.js'
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

    //strategia con GitHub
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.e97407450de44466',
        clientSecret:'39610f5586a850dbe830ffc903a565d3a99fdd64',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done)=>{
        //sugerencia:
        console.log('Profile', profile);
        try {
            let user = await UserModel.findOne({email: profile._json.email})
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age:15,
                    email: profile._json.email,
                    password: ''
                }
                let result = await UserModel.create(newUser)
                done(null,result)
            } else {
                done(null,user)
            }
        } catch (error) {
            return done(error)
        }
        
    }))

    //strategia para Google
    passport.use('google', new GoogleStrategy({
        clientID: '42043414310-d97je3itvd97094ievlmndlohlkq5ss9.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8080/api/sessions/googlecallback'

    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            let user = await UserModel.findOne({email: profile._json.email})
            if(!user) {
                let newUser = {
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    age:15,
                    email: profile._json.email,
                    password: ''
                }
                let result = await UserModel.create(newUser)
                done(null,result)
            } else {
                done(null,user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    //strategia para JWT
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([ cookieExtractor]),
        secretOrKey: 'coderhouse', //misma palabra que pusimos en la App!
    }, async (jwt_payload, done)=>{
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

//creamos el cookie extractor

const cookieExtractor = (req) => {
    let token = null
    if( req && req.cookies ){
        token = req.cookies['coderCookieToken']
    }
    return token
}

export default initializePassport