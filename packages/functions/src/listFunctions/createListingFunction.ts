import { prisma } from "@repo/database";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import pLimit from "p-limit";
import { createPropertySchema, CreatePropertySchema } from "@repo/validators";
import { AppError } from "../error.js";

interface CreateListingArgs {
  formData: CreatePropertySchema;
  userId: string;
}

const IMAGE_DIR = "/var/www/ekPratisatMonorepo/images/propertyImage";
const MAX_CONCURRENT_IMAGES = 5; // limit parallel Sharp processes

export async function createListingFunction({ formData, userId }: CreateListingArgs) {
  if (!userId) throw new AppError(401, "Unauthorized");

  const parsed = createPropertySchema.safeParse(formData);
  if (!parsed.success) throw new AppError(422, "Validation Failed!!!");

  const files = parsed.data.images || [];

  // Ensure directory exists
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  // Limit parallel processing to avoid CPU spikes
  const limit = pLimit(MAX_CONCURRENT_IMAGES);

  // Process images in parallel, streaming to disk immediately
  const imageUrls = await Promise.all(
    files.map((file) =>
      limit(async () => {
        const safeName = path.basename(file.name);
        const finalFilename = `${Date.now()}-${safeName.replace(path.extname(safeName), ".webp")}`;
        const filePath = path.join(IMAGE_DIR, finalFilename);

        await sharp(Buffer.from(await file.arrayBuffer()))
          .resize(1200)
          .toFormat("webp", { quality: 90 })
          .toFile(filePath);

        return `/images/propertyImage/${finalFilename}`;
      })
    )
  );

  try {
    // Create listing and images in a single transaction
    const listing = await prisma.$transaction(async (tx) => {
      return await tx.property.create({
        data: {
          ...parsed.data,
          userId,
          images: {
            create: imageUrls.map((url) => ({ url })),
          },
        },
      });
    });

    return {
      message: "Listing added successfully",
      listing,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    // Optionally: clean up images from disk if DB fails
    imageUrls.forEach((url) => {
      const filePath = path.join(IMAGE_DIR, path.basename(url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    throw new AppError(500, "Failed to create listing");
  }
}
