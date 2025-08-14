import express from 'express'
import { getAllOrders, getOrder, recentOrder, saveOrder } from '../controllers/order.js'
import { AdminAuthentication } from '../middleware/auth.js'
const orderRouter=express.Router()
orderRouter.post("/saveorder",saveOrder)
orderRouter.get("/getorder/:userId",userAuthentication,getOrder)
orderRouter.get("/getallorder",AdminAuthentication,getAllOrders)
orderRouter.get("/recentOrder",AdminAuthentication,recentOrder)
export default orderRouter;
