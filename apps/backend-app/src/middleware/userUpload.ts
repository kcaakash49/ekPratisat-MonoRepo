import multer from "multer";

const storage = multer.memoryStorage();

export const uploadUserFiles = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});