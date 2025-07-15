// middleware/multerMiddleware.js
import multer from 'multer';

// Use memory storage to keep file data in memory
const storage = multer.memoryStorage();

// File filter to accept only images (you can customize this)
const fileFilter = (req: any, file: { mimetype: string; }, cb: (arg0: null, arg1: boolean) => void) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (adjust as needed)
  }
});

export default upload;