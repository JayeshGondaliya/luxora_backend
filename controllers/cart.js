import Cart from '../models/cart.js';
import mongoose from 'mongoose';
export const addToCart=async(req,res)=>{
   try{
        const{userId,productId,quantity=1,size}=req.body;

        if(!userId||!productId||!size){
            return res.status(400).json({success:false,message:"Please Provides All The Details"})
        }

        let cart=await Cart.findOne({userId})
        //if cart exists
        if(cart){
               
            //if same items are exists in database so increase quantity
           const existItems = cart.items.find(para => para.productId.toString() === productId && para.size === size);
            console.log("existItems");
            console.log(existItems);
            
            
            if(existItems){
                existItems.quantity+=quantity;
                await cart.save()
            }
            else{
                cart.items.push({productId,quantity,size})
                await cart.save()
            }
        }
        else{
            cart= new Cart({userId,items:[{productId,quantity,size}]})
            await cart.save()
        }
        return res.status(200).json({success:true,message:"item added to cart"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:error.message})
        
    }
}





export const getCartItems = async (req, res) => {
    try {
          const {userId} = req.body;
        console.log('User ID from Authentication Middleware:', userId); 

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const cart = await Cart.findOne({ userId })
            .populate('items.productId', 'name price image')
            .exec();

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Log cart to check if it contains the correct data
        console.log('Cart data:', cart);

        // Filter out deleted or invalid products directly in the database query
        const filteredItems = cart.items.filter(item => item.productId !== null);

        // Log filtered items
        console.log('Filtered items:', filteredItems);

        // Recalculate the total based on filtered items
        let total = 0;
        filteredItems.forEach(item => {
            const final = item.productId.price * item.quantity;
            total += final;
        });

        return res.status(200).json({
            success: true,
            data: {
                cart: {
                    items: filteredItems,
                    total
                }
            }
        });
    } catch (error) {
        console.log("Error in getCartItems:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



export const updateToCart=async(req,res)=>{
    try {
        const {productId,userId,quantity,size}=req.body;
        if(!productId||!userId){
            return res.status(400).json({success:false,message:"all fields are required"})
        }
        const cart=await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({success:false,message:"cart not found"})
        }
           const item= cart.items.find(para=>para.productId.toString()===productId && para.size===size)
            if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }
        item.quantity=quantity
        await cart.save()
        return res.status(200).json({ success: true, message: "Item updated successfully" });
    } catch (error) {
            return res.status(404).json({success:false,message:error.message})
        
    }
}
export const deleteToCart=async(req,res)=>{
    try {
        const {productId,userId,size}=req.body;

            const cart=await Cart.findOne({userId});
            if(!cart){
                return res.status(404).json({success:false,message:"cart not found for specefic user"})
            }
         cart.items = cart.items.filter(item =>
            item.productId.toString() !== productId || item.size !== size
        );
            await cart.save()
         return res.status(200).json({success:true,message:"cart items deleted"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:error.message})
            }
}

async function clearToCart(userId) {
    try {
        const cart = await Cart.findOne({ userId });
        cart.items = [];
        cart.total = 0;

        await cart.save();
    } catch (error) {
        console.log("Error clearing cart:", error);
    }
}

export default clearToCart