import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    sessionId: {
    type: String,
    required: true,
    unique: true,
},

 userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
    email: { type: String, required: true },
    name:{type:String,required:true},
    paymentStatus: { type: String, default: 'Pending' },
    totalAmount: { type: Number, required: true },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            amount: { type: Number, required: false }
        }
    ],
   
},{
    timestamps:true
});

const Order = mongoose.model('Order', orderSchema);
export default Order
