
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [  
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      size: {
  type: String,
  enum: ["S", "M", "L", "XL","XXL"]
}

    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
