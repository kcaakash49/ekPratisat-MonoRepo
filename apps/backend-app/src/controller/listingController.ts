
import { Request, Response } from "express";
import {
  uploadCategoryImage,
} from "./../middleware/uploadCategoryImage.js";
import { addCategory, AppError, createListingFunction } from "@repo/functions";
import { triggerFrontendUpdate } from "../utils/revalidator.js";
import { prisma } from "@repo/database";

// Multer middleware for single file upload
export const uploadCategoryImageFile = uploadCategoryImage.single("image");

export async function createCategory(req: Request, res: Response) {
  try {
    const user = req.user; // from JWT middleware
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden, only admin can add categories" });
    }
    req.body.createdById = user.id;
    const adaptedFile = req.file
      ? {
          fieldname: req.file.fieldname,
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
        }
      : null;

    const result = await addCategory({
      body: req.body,
      file: adaptedFile,
    });

    triggerFrontendUpdate("categories");

    return res.status(201).json({
      ok: true,
      result,
    });
  } catch (err) {
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

export const addProperty = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    const body = req.body;
    const files = req.files as Express.Multer.File[];
    const normalized = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ]),
    );

    const parsed = {
      ...normalized,
      lat: normalized.lat ? Number(normalized.lat) : null,
      lng: normalized.lng ? Number(normalized.lng) : null,
      verified: normalized.verified === "true",
      userId: user.id,
    };

    if (parsed.verified && (user.role !== "admin" && user.role !== "staff")) {
      return res.status(403).json({
        message: "Forbidden, only admin or staff can verify properties",
      });
    }
    
    const adaptedFiles = files.map((file) => ({
      fieldname: file.fieldname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    }));

    const result = await createListingFunction({
      body: parsed,
      imageFiles: adaptedFiles,
    });

    if (result.listing.verified) {
      triggerFrontendUpdate("properties");
    }

    
    return res.status(201).json({
      ok: true,
      message: "Property added successfully",
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.status).json({
        message: err.message,
      });
    }
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//fetch user listings, with pagination
export const getUserListings = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    console.log("Fetching listings for user:", user.id);
    const { page = 1, limit = 10 } = req.query;

    const [total, listing] = await Promise.all([
      prisma.property.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.property.findMany({
        where: {
          userId: user.id,
          isActive:true
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          price:true,
          type:true,
          tole:true,
          verified:true,
          images: {
            select: {
              url: true,
            }
          },
          category: {
            select: {
              name:true
            }
          }
        },
      }),
    ]);

    return res.status(200).json({
      ok: true,
      listing,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
    