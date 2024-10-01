import { Router } from "express";
//import UserModel from '../dao/models/users.model.js'
//import {createHash, isValidPassword} from '../utils/util.js'
import passport from "passport";
//import generateToken from '../utils/jsonwentoken.js'
import {passportCall, authorization} from '../utils/util.js'
const router = Router()

//version para jsonwebtoken:
// router.post('/register', async(req,res) => {
//     const {first_name, last_name, email, password, age} = req.body
//     try {
//         //verificamos si el email ya existe
//         const existsUser = await UserModel.findOne({email:email})
//         if (existsUser) {
//             return res.status(400).send('El correo electronico ya esta registrado')
//         }
//         //si el email no esta usado, registrar un nuevo usuario:
//         const newUser = await UserModel.create({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//             age
//         })
//         //generamos un token
//         const token = generateToken({
//             first_name: newUser.first_name,
//             last_name: newUser.last_name,
//             email: newUser.email
//         }) 
//         res.status(201).send({message:'Usuario creado con exito', token})

//     } catch (error) {
//         res.status(500).send('Error del Servidor al Registrar')
//     }    
// })

// router.post('/register', async (req, res) => {
//     const {first_name, last_name, email, password, age} = req.body
//     try {
//         //verificamos si el email ya existe
//         const existsUser = await UserModel.findOne({email: email})
//         if (existsUser) {
//             return res.status(400).send('El correo electronico ya esta registrado')
//         }
//         //si el email no esta usado, registrar un nuevo usuario:
//         const newUser = await UserModel.create({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//             age
//         })
//         //almacenamos los datos del usuario en la sesion:
//         req.session.user = {
//             first_name: newUser.first_name,
//             last_name: newUser.last_name,
//             email: newUser.email,
//             age: newUser.age
//         }
//         req.session.login = true

//         //res.status(200).send('Usuario creado con exito')
//         res.redirect('/profile')
//     } catch (error) {
//         res.status(500).send('Error del Servidor al Registrar')
//     }
// })

//version para passport:
router.post('/register', passport.authenticate('register',{failureRedirect:'/api/sessions/failregister'}),async(req,res)=>{
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.login = true
    res.redirect('/profile')
})

router.get('/failregister', (req,res)=>{
    res.send('Registration Failed')
})

// router.post('/login', async(req, res)=>{
//     const {email, password} = req.body
//     try {
//         //verificamos  el email
//         const loggedUser = await UserModel.findOne({email: email})
//         if(loggedUser){
//             //si encuentro al usuaio, ahora verifico la contraseña
//             //if(logedUser.password === password) { //sin hashear
//             if(isValidPassword(password, loggedUser)){
//                 req.session.user = {
//                     first_name: loggedUser.first_name,
//                     last_name: loggedUser.last_name,
//                     email: loggedUser.email,
//                     age: loggedUser.age
//                 }
//                 req.session.login = true
//                 res.redirect('/profile')
//             } else {
//                 res.status(401).send('Password Incorrecto!!')
//             }
//         } else {
//             res.status(404).send('usuario no encontrado')
//         }
//     } catch (error) {
//         res.status(500).send('Error del Servidor en Login')
//     }
// })

// app.post('/login', (req,res)=>{
//     let {usuario, pass}=req.body
//     if(usuario==='tinki'&& pass==='winki'){
//         //let token = generateToken({usuario, pass})
//         let token = jwt.sign({usuario, pass, role:"admin"}, "coderhouse", {expiresIn: "24h"});
//         //res.send({message:'login exitoso oso!', token})
//         //enviamos desde cookies
//         res.cookie('coderCookieToken',token,{
//             maxAge:60*60*1000, //represnta 1 hora en milisegundos
//             httpOnly:true //solo se accede desde el protocolo HTTP
//         }).send({message:'login exitoso!!'})
//     } else {
//         res.send('no coincide nada!!')
//     }
// })

//version para passport:
router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/faillogin'}),async(req,res)=>{
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.login = true
    res.redirect('/profile')
})

router.get('/faillogin', (req,res)=>{
    res.send('Failed Login')
})

//version para jsonwebtoken, falta colocar status
// router.post('/login', async(req, res)=>{
//     const {email, password} = req.body
//     try {
//         //verificamos  el email
//         const loggedUser = await UserModel.findOne({email: email})
//         if(!loggedUser){
//             return res.send('Usuario No Encontrado')
//         }
//             //si encuentro al usuaio, ahora verifico la contraseña
//             //if(logedUser.password === password) { //sin hashear
//         if(!isValidPassword(password, loggedUser)){
//             return res.send('Credenciales Invalida!!')
//         }
//         //si la contraseña es correcta, voy a generar el token:
//         const token = generateToken({
//             first_name: loggedUser.first_name,
//             last_name: loggedUser.last_name,
//             email: loggedUser.email,
//             age: loggedUser.age
//         })
//         res.send({message: 'Login correcto!', token})
//         //console.log(token);
        
//     } catch (error) {
//         res.status(500).send('Error del Servidor en Login')
//     }
// })

router.get('/logout', (req, res) => {
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect('/login')
})

//version para GitHub
router.get('/github', passport.authenticate('github',{scope: ['user:email']}),async (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user
    req.session.login = true
    res.redirect('/profile')
})

//version para Google
router.get('/google', passport.authenticate('google',{scope: ['profile','email']}),async (req, res) => {

})

router.get('/googlecallback', passport.authenticate('google',{failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user
    req.session.login = true
    res.redirect('/profile')
})

// router.get('/current', passport.authenticate('jwt',{session: false}) ,(req, res) => {
//     res.send(req.user)
// })

//usando el PassportCall
router.get('/current', passportCall('jwt'), authorization('user') ,(req, res) => {
    res.send(req.user)
})

export default router