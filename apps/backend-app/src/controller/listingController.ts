import { Request, Response } from "express";
import { uploadCategoryImage } from "./../middleware/uploadCategoryImage.js";
import {
  addCategory,
  AppError,
  createListingFunction,
  updateListingFunction,
} from "@repo/functions";
import { triggerFrontendUpdate } from "../utils/revalidator.js";
import { Prisma, prisma } from "@repo/database";

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

    // triggerFrontendUpdate(`listings-${result.listing.userId}`);

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
        id: propertyId,
      },
      data: {
        verified: true,
      },
    });

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
      where: { id: propertyId, isActive: true },
    });

    if (!property || !property.verified) {
      return res.status(400).json({
        message: "Property isn't verified, Verify First!!!",
      });
    }
    const result = await prisma.property.update({
      where: { id: property.id },
      data: { isFeatured: !isFeatured },
    });

    triggerFrontendUpdate("properties");
    triggerFrontendUpdate(`listings-${result.userId}`);

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

//favourite toggle

export async function toggleFavourite(req: Request, res: Response) {
  try {
    const { propertyId } = req.body;
    const { id } = req.user;

    const existing = await prisma.favourite.findUnique({
      where: {
        userId_propertyId: { userId: id, propertyId },
      },
    });

    if (existing) {
      await prisma.favourite.delete({
        where: { id: existing.id },
      });
      // triggerFrontendUpdate(`favourite-${id}`);
      return res.status(200).json({
        message: "Removed from Favourites!!!",
      });
    } else {
      await prisma.favourite.create({
        data: {
          userId: id,
          propertyId,
        },
      });
      // triggerFrontendUpdate(`favourite-${id}`);
      return res.status(200).json({
        message: "Added to Favourites!!!",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    return res.status(500).json({
      message: "Couldn't toggle favourite!!!",
    });
  }
}

export async function checkFavourite(req: Request, res: Response) {
  try {
    const { userId, propertyId } = req.body;

    const existing = await prisma.favourite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    return res.status(200).json({ result: !!existing });
  } catch (err) {
    console.error("getting favourite error", err);
    return res.status(200).json({
      result: false,
    });
  }
}

export async function fetchUserFavourites(req: Request, res: Response) {
  try {
    const { id } = req.user;
    const favourites = await prisma.favourite.findMany({
      where: { userId: id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            noOfBedRooms: true,
            noOfFloors: true,
            noOfRestRooms: true,
            isFeatured: true,
            landArea: true,
            floorArea: true,
            tole: true,
            category: {
              select: {
                name: true,
              },
            },
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = favourites.map((f) => f.property);

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

//get-all properties

export async function getAllProperties(req: Request, res: Response) {
  try {
    const queries = req.query;
    console.log("queries", queries);
    const page = Math.max(1, Number(queries.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(queries.pageSize || 20)));

    const isVerifiedQuery = queries.isVerified || "";
    const filterVerified =
      isVerifiedQuery === "true"
        ? true
        : isVerifiedQuery === "false"
          ? false
          : undefined;

    const isActiveQuery = queries.isActive;
    const filterActive =
      isActiveQuery === "true"
        ? true
        : isActiveQuery === "false"
          ? false
          : undefined;

    const isFeaturedQuery = queries.isFeatured || "";
    const filterFeature =
      isFeaturedQuery === "true"
        ? true
        : isFeaturedQuery === "false"
          ? false
          : undefined;

    const q = String(queries.q || "")
      .toLowerCase()
      .trim();
    const c_id = String(queries.c_id || "")
      .toLowerCase()
      .trim();

    const typeQuery = String(queries.type || "")
      .toLowerCase()
      .trim();
    const validTypes = ["rent", "sale"];
    const filterType = validTypes.includes(typeQuery)
      ? (typeQuery as "rent" | "sale")
      : undefined;

    const where: Prisma.PropertyWhereInput = {
      ...(filterVerified !== undefined && { verified: filterVerified }),
      ...(filterActive !== undefined && { isActive: filterActive }),
      ...(filterFeature !== undefined && { isFeatured: filterFeature }),
      ...(filterType !== undefined && { type: filterType }),
      ...(c_id && { categoryId: c_id }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { tole: { contains: q, mode: "insensitive" } },
          {
            location: {
              municipality: {
                name: { contains: q, mode: "insensitive" },
              },
            },
          },
          {
            location: {
              municipality: {
                district: {
                  name: { contains: q, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        select: {
          id: true,
          title: true,
          type: true,
          verified: true,
          isFeatured: true,
          tole: true,
          createdAt: true,
          location: {
            select: {
              name: true,
              municipality: {
                select: {
                  name: true,
                  district: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);
    return res.status(200).json({
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
}

//update Property
export async function updateProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = req.user;
    const body = req.body;

    const files = req.files as Express.Multer.File[];
    const normalized = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ]),
    );

    let deleteImageIds: string[] = [];

    try {
      const parsedIds = body.deleteImageIds
        ? JSON.parse(body.deleteImageIds)
        : [];

      deleteImageIds = Array.isArray(parsedIds) ? parsedIds : [];
    } catch {
      deleteImageIds = [];
    }

    const parsed = {
      ...normalized,
      lat: normalized.lat ? Number(normalized.lat) : null,
      lng: normalized.lng ? Number(normalized.lng) : null,
      // verified: user.role === "admin" && normalized.verified === "true",
      verified: normalized.verified === "true",
      deleteImageIds,
      propertyId: id,
    };

    const adaptedFiles = files.map((file) => ({
      fieldname: file.fieldname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    }));

    const result = await updateListingFunction({
      body: parsed,
      userInfo: { userId: user.id, userRole: user.role },
      imageFiles: adaptedFiles,
    });

    if(user.role === "admin"){
      triggerFrontendUpdate("properties");
      triggerFrontendUpdate(`listings-${result.ownerId}`);
      triggerFrontendUpdate("favourite");
    }
   
    return res.status(200).json({
      ok: true,
      message: "Listing Updated Successfully",
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
}

//deactivating listing

export async function deactivateListing(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const user = req.user!;

    if (!id || Array.isArray(id)) {
      throw new AppError(400, "Invalid property id");
    }

    const result = await prisma.$transaction(async (tx) => {
      const property = await tx.property.findUnique({ where: { id } });

      if (!property) throw new AppError(404, "Property Not Found");

      if (property.userId !== user.id && user.role !== "admin") {
        throw new AppError(403, "Unauthorized!!!");
      }

      await tx.favourite.deleteMany({
        where: { propertyId: property.id },
      });

      return tx.property.update({
        where: { id },
        data: { isActive: false },
      });
    });

    // if (result.verified) {
    //   triggerFrontendUpdate("properties");
    // }

    // await Promise.allSettled([
    //   triggerFrontendUpdate(`listings-${result.userId}`),
    //   triggerFrontendUpdate("favourite"),
    // ]);

    res.status(200).json({
      message: "Property Deleted Successfully!!!",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function toggleActivateListing(req: Request, res: Response) {
  try {
    const user = req.user;
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      throw new AppError(400, "Invalid property id");
    }

    if (user.role !== "admin") {
      throw new AppError(403, "Unauthorized!!!");
    }

    const result = await prisma.$transaction(async (tx) => {
      const property = await tx.property.findUnique({
        where: { id },
      });

      if (!property) {
        throw new AppError(404, "Property not found!!!");
      }

      const willDeActivate = property.isActive;
      if (willDeActivate) {
        await tx.favourite.deleteMany({
          where: { propertyId: property.id },
        });
      }

      return tx.property.update({
        where: { id: property.id },
        data: {
          isActive: !property.isActive,
        },
      });
    });

    triggerFrontendUpdate("properties");
    triggerFrontendUpdate("favourite");
    triggerFrontendUpdate(`listings-${result.userId}`);

    return res.status(200).json({
      message: "Listing status updated successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
