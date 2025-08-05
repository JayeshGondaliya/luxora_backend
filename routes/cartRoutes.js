import express from 'express'
import { addToCart, deleteToCart, getCartItems, updateToCart } from '../controllers/cart.js'
import {  userAuthentication } from '../middleware/auth.js'
// import cart from '../models/cart.js'
const cartRouter=express.Router()
cartRouter.post("/addtocart",addToCart)
cartRouter.post("/gettocart",userAuthentication,getCartItems)
cartRouter.post("/updatetocart",userAuthentication,updateToCart)
cartRouter.post("/deletetocart",userAuthentication,deleteToCart)
export default cartRouter;      