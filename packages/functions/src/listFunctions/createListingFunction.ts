import { prisma } from "@repo/database";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import pLimit from "p-limit";
import { createPropertySchema, CreatePropertySchema } from "@repo/validators";
import { AppError } from "../error.js";
import { randomUUID } from "crypto";
import { UploadedFile } from "../authFunctions/addUserFunction.js";


const IMAGE_DIR = "/var/www/ekPratisatMonorepo/images/propertyImage";
const MAX_CONCURRENT_IMAGES = 5; // limit parallel Sharp processes

export async function createListingFunction({
  body,
  imageFiles
}: {
  body: any;
  imageFiles: UploadedFile[];
}) {
  

  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) throw new AppError(422, "Validation Failed!!!");

  // Limit parallel processing to avoid CPU spikes
  const limit = pLimit(MAX_CONCURRENT_IMAGES);

  // Process images in parallel, streaming to disk immediately
  const imageUrls = await Promise.all(
    imageFiles.map((file) =>
      limit(async () => {
        const safeName = path.basename(file.originalname);
        const finalFilename = `${Date.now()}-${safeName.replace(path.extname(safeName), ".webp")}`;
        const filePath = path.join(IMAGE_DIR, finalFilename);

        await sharp(Buffer.from(file.buffer))
          .resize(1200)
          .toFormat("webp", { quality: 90 })
          .toFile(filePath);

        return `/image/propertyImage/${finalFilename}`;
      })
    )
  );

  const { images: _images, lat, lng, ...data } = parsed.data;

  try {
    const listing = await prisma.$transaction(async (tx) => {
      // Generate id in app (since we're doing raw insert)
      const propertyId = randomUUID();
      // Insert property with geoPoint using PostGIS
      // NOTE: ST_MakePoint takes (lng, lat)
      const inserted = await tx.$queryRaw<any[]>`
  INSERT INTO "public"."Property" (
    "id",
    "title",
    "description",
    "price",
    "type",
    "categoryId",
    "userId",
    "noOfBedRooms",
    "noOfRestRooms",
    "landArea",
    "noOfFloors",
    "propertyAge",
    "facingDirection",
    "floorArea",
    "roadSize",
    "verified",
    "locationId",
    "createdAt",
    "updatedAt",
    "floorLevel",
    "tole",
    "geoPoint"
  )
  VALUES (
    ${propertyId},
    ${data.title},
    ${data.description},
    ${data.price},
    ${data.type}::"SaleType",
    ${data.categoryId},
    ${body.userId},
    ${data.noOfBedRooms},
    ${data.noOfRestRooms},
    ${data.landArea},
    ${data.noOfFloors},
    ${data.propertyAge},
    ${data.facingDirection},
    ${data.floorArea},
    ${data.roadSize},
    ${data.verified ?? false},
    ${data.locationId},
    NOW(),
    NOW(),
    ${data.floorLevel},
    ${data.tole},
    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
  )
  RETURNING
    "id",
    "title",
    "description",
    "price",
    "type",
    "categoryId",
    "userId",
    "noOfBedRooms",
    "noOfRestRooms",
    "landArea",
    "noOfFloors",
    "propertyAge",
    "facingDirection",
    "floorArea",
    "roadSize",
    "verified",
    "locationId",
    "createdAt",
    "updatedAt",
    "floorLevel",
    "tole";
`;
      if(!inserted.length){
        throw new AppError(404, "Property creation failed!!!")
      }
      const propertyRow = inserted[0];

      // Insert images referencing the new property
      if (imageUrls.length) {
        await tx.image.createMany({
          data: imageUrls.map((url) => ({
            url,
            propertyId: propertyRow.id,
          })),
        });
      }

      return propertyRow;
    });
    return {
      message: "Listing added successfully",
      listing,
      status: 200,
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
