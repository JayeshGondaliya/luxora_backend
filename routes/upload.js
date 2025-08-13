// import express from 'express';
// import multer from 'multer';
// import upload from '../utils/multer.js';
// const uploadRouter = express.Router();

// uploadRouter.post('/upload', upload.single('image'), (req, res) => {
//   console.log("req.file:-",req.file);
  
//   if (!req.file) {
//     return res.status(400).json({ message: 'File not found' });
//   }

//  return res.json({
//     message: 'Upload successful',
//     url: req.file.path, 
//   });
// });

// export default uploadRouter;
