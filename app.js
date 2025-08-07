import express from 'express'
const app=express()
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import {connect} from './config/db.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import paymentsRouter from './routes/paymentsRouter.js';
import orderRouter from './routes/orderRoutes.js';
import authorised from './routes/authorised.js';
import adminRouter from './routes/admin.js';
import pdfRouter from './routes/pdf.js';

const corsOptions = {
  origin: ['https://luxora-frontend-psi.vercel.app',"https://luxora-admin-ten.vercel.app",'http://localhost:3000',"http://localhost:3001",], 
  credentials: true, 
};
app.use(cors(corsOptions)); 
app.use(cookieParser()); 


//session
app.use(session({
    secret: 'this is secret key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24*60*60*1000,
        httpOnly: true,
        secure: false   
    }
}));

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

//dotenv
dotenv.config()

// Get the current directory of the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' folder
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

app.use('/pdf', express.static(path.join(__dirname, 'invoices')));



//routes
app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/auth",authorised)
app.use("/api/payments",paymentsRouter)
app.use("/api/order",orderRouter)
app.use("/api/admin",adminRouter)
app.use('/api/pdf', pdfRouter);
//default
// app.use("/",async(req,res)=>{
//     res.send("jay mataji")
// })

//start server
const PORT=process.env.PORT||3003
const startServer = async () => {
    try {
        await connect(); 
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1); 
    }
};

startServer();
