import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure storage with unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/www/images/epPratisatMonorepo/category'); // Save in uploads/categories/
  },
  filename: (req, file, cb) => {
    // Add timestamp + random string to ensure unique names
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    // Remove special characters and spaces
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    cb(null, `${cleanName}-${uniqueSuffix}${extension}`);
  }
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Multer instance configuration
export const uploadCategoryImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Utility function to delete file if operation fails
export const deleteFile = (filePath: string) => {
  const fs = require('fs').promises;
  return fs.unlink(filePath).catch(() => {});
};