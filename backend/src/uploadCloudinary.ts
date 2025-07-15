// config/cloudinary.js (or in your index.js)
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Get from environment variables
  api_key: process.env.CLOUDINARY_API_KEY,        // Get from environment variables
  api_secret: process.env.CLOUDINARY_API_SECRET   // Get from environment variables
});

export default cloudinary;