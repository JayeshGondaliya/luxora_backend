import multer from 'multer';
import { storage } from './cloudinary.js';

// File size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

export default upload;