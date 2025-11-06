import Order from '../models/order.js'
import clearToCart from './cart.js';

export const saveOrder = async (req, res) => {
  const { sessionId,userId, email, name, payments_status, totalAmount, items ,amount} = req.body;

   const existing = await Order.findOne({ sessionId });
    if (existing) {
        return res.status(200).json({
            success: false,
            message: "Order already saved for this session.",
        });
    }
  const orderData = {
    sessionId,
    userId,
    email,
    name,
    paymentStatus:payments_status,
    totalAmount,
    items,
    amount
  };

  try {
    const savedOrder = await Order.create(orderData);

    // Corrected function name
   await clearToCart(userId)
 // Clear cart after saving order

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders=async(req,res)=>{
  try {
    const allOrder=await Order.find({})
    if(allOrder.length<0){
      return res.status(400).json({success:false,message:"No orders"})
    }
    return res.status(200).json({success:true,data:allOrder})
  } catch (error) {
      console.error("Error saving order:", err);
    return res.status(500).json({ error: err.message });
  }


}
export const getOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all orders by userId
        const orders = await Order.find({ userId });

        // Calculate total number of orders
        const totalOrders = orders.length;

        res.status(200).json({
            success: true,
            totalOrders,
            data: orders
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error Fetching Orders" });
    }
};




//get recent order for the admin panel
export const recentOrder=async(req,res)=>{
  try {
    const recentOrders=await Order.find().sort({createdAt:-1}).limit(5);
    if(!recentOrders){
      return res.status(400).json({success:false,message:"No Cureently Any order"})
    }
    return res.status(200).json({success:true,data:recentOrders})
  } catch (error) {
         return res.status(500).json({ success: false, message: "Error fetching orders" });
  }
}