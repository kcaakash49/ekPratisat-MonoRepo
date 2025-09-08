import { prisma } from "@repo/database";
import { categorySchema } from "@repo/validators";
import { Request, Response } from "express";
import { uploadCategoryImage, deleteFile } from "./../middleware/uploadCategoryImage.js";
import path from "path";

// Multer middleware for single file upload
export const uploadCategoryImageFile = uploadCategoryImage.single('image');

export async function addCategory(req: Request, res: Response) {
  // Check authorization FIRST before any file processing
  const { id, role } = req.user;

  // 1. Authorization check - BEFORE any file operations
  if (role !== "admin") {
    // If file was uploaded despite auth failure, delete it immediately
    if (req.file) {
      await deleteFile(req.file.path);
    }
    return res.status(403).json({ 
      error: "Unauthorized: Only admins can create categories" 
    });
  }

  // Transaction for atomic operations
  const transaction = await prisma.$transaction(async (tx) => {
    try {
      // 2. Validate input data (excluding file)
      const result = categorySchema.safeParse(req.body);
      if (!result.success) {
        throw new Error(`Validation failed: ${JSON.stringify(result.error.issues)}`);
      }

      let imageUrl = null;

      // 3. Handle file upload if present
      if (req.file) {
        // Construct public URL for the image
        imageUrl = `/var/www/images/ekPratisatMonorepo/${req.file.filename}`;
        
        // You might want to upload to cloud storage instead:
        // imageUrl = await uploadToCloudStorage(req.file);
      }

      // 4. Create category in database
      const category = await tx.category.create({
        data: {
          name: result.data.name,
          imageUrl: imageUrl!,
          isLandAreaNeeded: result.data.isLandAreaNeeded,
          isNoOfFloorsNeeded: result.data.isNoOfFloorsNeeded,
          isNoOfRoomsNeeded: result.data.isNoOfRoomsNeeded,
          isAgeOfThePropertyNeeded: result.data.isAgeOfThePropertyNeeded,
          isNoOfRestRoomsNeeded: result.data.isNoOfRestRoomsNeeded,
          isFacingDirectionNeeded: result.data.isFacingDirectionNeeded,
          isFloorAreaNeeded: result.data.isFloorAreaNeeded,
          isFloorLevelNeeded: result.data.isFloorLevelNeeded,
          isRoadSizeNeeded: result.data.isRoadSizeNeeded,
          addedById: id,
        }
      })

      return category;

    } catch (error) {
      // 5. If anything fails, clean up uploaded file
      if (req.file) {
        await deleteFile(req.file.path);
      }
      throw error; // Re-throw to trigger transaction rollback
    }
  });

  try {
    const category = await transaction;
    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    console.error("Category creation failed:", error);
    
    if (error.message.includes("Unauthorized")) {
      res.status(403).json({ error: error.message });
    } else if (error.message.includes("Validation failed")) {
      res.status(400).json({ error: JSON.parse(error.message.split(": ")[1]) });
    } else {
      res.status(500).json({ error: "Failed to create category" });
    }
  }
}