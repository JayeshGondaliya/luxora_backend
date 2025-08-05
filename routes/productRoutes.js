import express from 'express'
import { addProduct, categoryFetchItem, deleteProduct, editProduct, getProduct, getProductAll } from '../controllers/product.js'
import multer from "multer";
import { AdminAuthentication } from '../middleware/auth.js';

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
      
          cb(null,file.originalname);
    }
})

 const upload = multer({ storage });
const productRouter=express.Router();
productRouter.post('/addProduct', upload.single('image'), addProduct);
productRouter.get("/getproduct/:productId",getProduct)
productRouter.get("/getProductAll",getProductAll);
productRouter.post("/editProduct/:productId",AdminAuthentication,upload.single('image'),editProduct);
productRouter.delete("/deleteProduct/:productId",AdminAuthentication,deleteProduct)
productRouter.get("/categoryFetchItem/:category",categoryFetchItem)
export default productRouter;