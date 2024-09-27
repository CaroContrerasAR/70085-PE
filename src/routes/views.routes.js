import { Router } from 'express'
import ProductManager from '../dao/db/productsManager.db.js'
import ProductModel from '../dao/models/products.model.js'
import CartModel from '../dao/models/carts.model.js'

const router = Router()
const manager = new ProductManager()

router.get('/home', async (req, res) => {
    try {
        //const products = await manager.getProducts()
        const products = await ProductModel.find().lean()
        res.render("home", {title:'Home', products})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/realtimeproducts', async (req, res) => {
    //solo con websockets, al crear o eñliminar productos se actualiza atumaticamente la vista
    try {
        //const products = await manager.getProducts()
        const products = await ProductModel.find().lean()
        res.render("realTimeProducts", {title:'RealTimeProducts',products})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/products', async (req, res) => {
    // try {
    //     const products = await manager.getProducts()
    //     res.render("products", {title:'Products', products})
    // } catch (error) {
    //     res.status(500).send({ error: error.message })
    // }
    try {
        const limit= parseInt( req.query.limit,10 ) || 10
        const page=parseInt( req.query.page, 10 ) || 1
        const sort = req.query.sort === 'asc' ? 'asc' : req.query.sort === 'desc' ? 'desc' : undefined
        const query = req.query.category || null

        //console.log('Params:', {page, limit, sort, query});
        //obtener los productos con paginacion
        const products = await manager.getProducts({page, limit, sort, query})
        
        //console.log('Products returned:', products);
        const totalProducts= products.totalDocs
        const totalPages = products.totalPages
        //determinar pagina previa y siguiente
        const prevPage = page > 1 ? page - 1 : null
        const nextPage = page < totalPages ? page + 1 : null
    
        const productsFinal = products.docs.map( prod=>{
            const {_id, ...rest}= prod//.toObject()
            return rest
        })
        res.render("products", {title:'Products',
            status:'success',
            products:productsFinal,
            currentPage: products.page,
            totalPages,
            hasPrevPage:products.hasPrevPage,
            hasNextPage:products.hasNextPage,
            prevPage,//: products.hasPrevPage ? products.page - 1 : null,
            nextPage,//: products.hasNextPage ? products.page + 1 : null,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${page - 1}`: null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${page + 1}`: null,
            //prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            //nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        })
    } catch (error) {
        res.status(500).send({status:'error', error: error.message })
    }
})

router.get('/carts/:id', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.id).populate('products.product').lean()
        const totalPrice = cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        res.render("carts", {title:'Carts',
            cart,
            totalPrice    
        })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/register', (req,res)=>{
    if(req.session.login){
        return res.redirect('/profile')
    }
    res.render('registro')
})

router.get('/login', (req,res)=>{
    if(req.session.login){
        return res.redirect('/profile')
    }
    res.render('login')
})

router.get('/profile', (req,res)=>{
    //si no esta logueado:
    if(!req.session.login){
        return res.redirect('/login')
    }
    res.render('perfil', {user: req.session.user})
})

export default router