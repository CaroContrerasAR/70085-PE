import { Router } from "express";
import CartManager from '../dao/db/cartsManager.db.js'
import CartModel from '../dao/models/carts.model.js'
//import ProductModel from '../dao/models/products.model.js'

const router = Router()
const manager = new CartManager()

//Listar carritos con populate. GET localhost:8080/api/carts
router.get('/', async (req, res)=>{
    try {
        const allCarts = await CartModel.find().populate('products.product')
        res.status(200).json(allCarts)
    } catch (error) {
        res.status(500).send({ status: 'Error', message:error.message  })
    }
})

//Crea carrito. POST localhost:8080/api/carts
router.post('/', async (req, res) => {
    try{
        const newCart = await manager.createCarts()
        res.status(201).json(newCart)                
    } catch(error){
        res.status(500).send({ status: 'Error', message:error.message })
    }
})

//Listar carrito por id. GET localhost:8080/api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const findCarts = await manager.getCartsById(req.params.cid)
        res.status(200).json( findCarts.products )
    } catch (error) {
        res.status(500).send({ status: 'Error', message:error.message })
    }
})

//Agregar productos al Carrito. POST localhost:8080/api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid  
    const productId = req.params.pid
    const quantity = req.body.quantity || 1
    try{
        const updatedCarts = await manager.addProductInCart(cartId,productId, quantity)
        res.status(200).json(updatedCarts.products)
    } catch (error) {
        res.status(500).send({ status: 'Error', message:error.message })
    }
})

//Eliminar del carrito el producto seleccionado. DELETE localhost:8080/api/carts/:cid/product/:pid
router.delete('/:cid/products/:pid', async(req,res) => {
    const cartId =req.params.cid
    const productId = req.params.pid
    try {
        const result = await manager.deleteProducts(cartId, productId)
        if (!result){
            res.status(200).json({status:'success', message:'product deleted in cart successfully',result})
        } else {
            res.status(404).send('Cart not found')
        }
    } catch (error) {
        res.status(500).send({ error: error.message, message:"DEL Error with pid in cid" })
    }
})

//Actualiza todos los productos del carrito con un arreglo de productos. PUT localhost:8080/api/carts/66cd0eb48e443b64dd42a945
router.put('/:cid', async(req,res) => {
    const id = req.params.cid
    const updateCart = req.body
    try {
         res.status(200).send(await manager.updateCart(id, updateCart))
    } catch (error) {
        res.status(500).send({ error: error.message, message:"PUT Error with cid" })
    }
})

//Actualiza SOLO la cantidad de unidades del productos por cantidad enviada desde body. PUT localhost:8080/api/carts/66cb395cca1e704691c337cd/product/66cb8d0bf053b724845f0165
router.put('/:cid/products/:pid', async(req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body
    try {
         res.status(200).send(await manager.updateQttyCart(cid, pid, quantity))
    } catch (error) {
        res.status(500).send({ error: error.message, message:"PUT Error with cid" })
    }
})
//eliminar TODOS los productos del carrito DELETE localhost:8080/api/carts/66cd0eb48e443b64dd42a945
router.delete('/:cid', async(req,res) => {
    try {
        const cart = await manager.emptyCarts(req.params.cid)
        if (cart){
            res.status(200).send('Cart empty')
        } else {
            res.status(404).send('Cart not found')
        }
    } catch (error) {
        res.status(500).send({ error: error.message, message:"DEL Error emptying with cid" })
    }
})
export default router