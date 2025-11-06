import Product from '../models/product.js';

export const addProduct = async (req, res) => {
  try {
    // console.log("1234567890");
    
    const { name, description, price, quantity, category, discount, ratings } = req.body;
  
 const imageUrl = req.file?.path;
    const publicId = req.file?.filename;
    if (!name || !description || !price || !quantity || !category || !imageUrl) {
      return res.status(400).json({ success: false, message: 'All Required Fields including image must be provided.' });
    }

    //  const product = await Product.findOne({ image });
    // if (product) {
    //   return res.status(400).json({ success: false, message: 'This product already exists, please choose another image.' });
    // }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category,
      discount,
      ratings,
      image: imageUrl,
      imagePublicId: publicId 
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};



export const getProductAll=async(req,res)=>{
  
    try {
        const product=await Product.find().sort({createdAt:-1});
        if(product.length===0){
            return res.status(400).json({success:false,message:"no products are available now"})
        }
        return res.status(200).json({success:true,data:product})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}


//get specefic product
export const getProduct=async(req,res)=>{
  try {
    const {productId}=req.params;
    const product=await Product.findById(productId);
        if(!product){
            return res.status(400).json({success:false,message:"no products are available now"})
        }
        return res.status(200).json({success:true,data:product})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}
export const editProduct=async(req,res)=>{
  try {
    const {productId}=req.params;
    
    const { name, description, price, quantity, category, discount, ratings } = req.body;
    // const image = req.file ? req.file.originalname : null;
    const imageUrl = req.file?.path;

    if(!productId){
      return res.status(400).json({success:false,message:"required productId"})
    }
    const product=await Product.findById(productId);
    if(!product){
      return res.status(404).json({success:false,message:"product not found"})
    }
    product.name=name;
    product.description=description;
    product.price=price;
    product.quantity=quantity;
    product.category=category;
    product.discount=discount;
    product.ratings=ratings;
    product.image=imageUrl
    await product.save()
    return res.status(200).json({success:true,data:product})
  } catch (error) {
        return res.status(400).json({success:false,message:error.message})
  }
}
export const deleteProduct=async(req,res)=>{
    try {
        const {productId}=req.params;

        if(!productId){
            return res.status(400).json({success:false,message:"please provide product id"})
        }

        const product=await Product.findOne({_id:productId})
        if(!product){
            return res.status(400).json({success:false,message:"product  is not found"})

        }
        await Product.findByIdAndDelete(productId)
        return res.status(200).json({success:true,message:"product are deleted"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:error.message})
    }
}



//category based fetch items
export const categoryFetchItem=async(req,res)=>{
  try {
    const {category}=req.params;
    const result=await Product.find({category});
    if(result.length<0){
      return res.status(400).json({success:false,message:"product less than 0"})
    }
    return res.status(200).json({success:true,data:result})
  } catch (error) {
     console.log(error);
        return res.status(400).json({success:false,message:error.message})
  }
}
