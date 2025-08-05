import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
   
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  image: {
    type: String, 
    required: true,
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
