import { Router } from "express";
import UserModel from '../dao/models/users.model.js'
import {createHash, isValidPassword} from '../utils/util.js'
import passport from "passport";
const router = Router()

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

router.get('/logout', (req, res) => {
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect('/login')
})

router.get('/failregister', (req,res)=>{
    res.send('Registration Failed')
})

router.get('/faillogin', (req,res)=>{
    res.send('Failed Login')
})
export default router