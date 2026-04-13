import { Request, Response } from "express";
import { uploadCategoryImage } from "./../middleware/uploadCategoryImage.js";
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

    if (parsed.verified && user.role !== "admin" && user.role !== "staff") {
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
    console.log(result);

    if (result.listing.verified) {
      triggerFrontendUpdate("properties");
    }

    triggerFrontendUpdate(`listings-${result.listing.userId}`);

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
    const { page = 1, pageSize = 10 } = req.query;
    if (Number(page) <= 0 || Number(pageSize) <= 0) {
      return res.status(400).json({
        message: "Page and pageSize must be positive integers",
      });
    }

    const [total, listing] = await Promise.all([
      prisma.property.count({
        where: {
          userId: user.id,
          isActive: true,
        },
      }),
      prisma.property.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          price: true,
          type: true,
          tole: true,
          verified: true,
          images: {
            select: {
              url: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      listing,
      meta: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.max(1, Math.ceil(total / Number(pageSize))),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//mark listing verified

export async function verifyListing(req: Request, res: Response) {
  try {
    const { propertyId } = req.body;
    const result = await prisma.property.update({
      where: {
        id:propertyId,
      },
      data: {
        verified: true,
      },
    });
    console.log("Result", result);
    triggerFrontendUpdate("properties");
    triggerFrontendUpdate(`listings-${result.userId}`);

    return res.status(200).json({
      message: "Property Verified!!!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
}

//mark listing featured

export async function featureListing(req: Request, res: Response) {
  try {
    const { propertyId, isFeatured } = req.body;
    const property = await prisma.property.findUnique({
      where: {id:propertyId,isActive:true },
    });

    if (!property || !property.verified) {
      return res.status(400).json({
        message: "Property isn't verified, Verify First!!!",
      });
    }
    await prisma.property.update({
      where: { id: property.id },
      data: { isFeatured: !isFeatured },
    });

    return res.status(200).json({
      message: "Property Featured Successfully!!!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
}
