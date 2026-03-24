import { prisma } from "@repo/database";
import { categorySchema } from "@repo/validators";
import { Request, Response } from "express";
import { uploadCategoryImage, deleteFile } from "./../middleware/uploadCategoryImage.js";
import path from "path";
import { addCategory, AppError } from "@repo/functions";

// Multer middleware for single file upload
export const uploadCategoryImageFile = uploadCategoryImage.single('image');

export async function createCategory(req: Request, res: Response) {
 try{
  const user = req.user; // from JWT middleware
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden, only admin can add categories" });
  }
  req.body.createdById = user.id;
  console.log(req.file);
  const adaptedFile = req.file ? {
    fieldname: req.file.fieldname,
    buffer: req.file.buffer,
    mimetype: req.file.mimetype,
    originalname: req.file.originalname,    
  } : null;

  const result = await addCategory({
    body: req.body,
    file: adaptedFile
  });

  return res.status(201).json({
    ok: true,
    result,
  });
 }catch(err){
    if (err instanceof AppError) {
      return res.status(err.status).json({
        message: err.message,
        
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",   
    }); 
 }
}