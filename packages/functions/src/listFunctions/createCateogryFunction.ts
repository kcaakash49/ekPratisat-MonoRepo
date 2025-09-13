import { CategorySchema, categorySchema } from "@repo/validators";
import { AppError } from "../error.js";
import path, { parse } from "path";
import sharp from "sharp";
import fs from "fs";
import { prisma } from "@repo/database";


// adding category
export async function addCategory(formData: CategorySchema){
    const parsed = categorySchema.safeParse(formData);
    if (!parsed.success){
        throw new AppError(422, "Validation Failed!!!")
    }

    try {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: parsed.data.name
            }
        })

        if( existingCategory ){
            throw new AppError(409, "Category Already Exist");
        }
        
        let imageUrl = "";
        const file = parsed.data.image;
        const filename = Date.now() + "-" + file.name;
        const outputFormat = 'webp';
        const filePath = path.join("/var/www/ekPratisatMonorepo/images/categoryImage", filename.replace(path.extname(filename), `.${outputFormat}`));
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await sharp(buffer).resize(1200).toFormat(outputFormat, { quality: 100}).toBuffer();

        await fs.promises.writeFile(filePath, optimizedBuffer);

        imageUrl = `/categoryImage/${path.basename(filePath)}`;

        const category = await prisma.category.create({
            data: {
                name: parsed.data.name,
                imageUrl: imageUrl,
                addedById: parsed.data.addedById!,
                isAgeOfThePropertyNeeded: parsed.data.isAgeOfThePropertyNeeded,
                isFacingDirectionNeeded: parsed.data.isFacingDirectionNeeded,
                isFloorAreaNeeded: parsed.data.isFloorAreaNeeded,
                isFloorLevelNeeded: parsed.data.isFloorLevelNeeded,
                isLandAreaNeeded: parsed.data.isLandAreaNeeded,
                isNoOfFloorsNeeded:parsed.data.isNoOfFloorsNeeded,
                isNoOfRestRoomsNeeded:parsed.data.isNoOfRestRoomsNeeded,
                isNoOfRoomsNeeded: parsed.data.isNoOfRoomsNeeded,
                isRoadSizeNeeded: parsed.data.isRoadSizeNeeded,
            }
        })
        
        return {
            status: 200,
            message: "Category Created Successfully",
            category
        }
    }catch (error) {
        if (error instanceof AppError){
            throw error;
        }
        console.error(error);
        throw new AppError(500, "Internal Server Error");
    }
}




// // @repo/functions/category.ts
// import { CategorySchema, categorySchema } from "@repo/validators";
// import { AppError } from "../error.js";
// import path from "path";
// import sharp from "sharp";
// import fs from "fs";
// import { prisma } from "@repo/database";

// // adding category
// export async function addCategory(formData: CategorySchema & { addedById?: string }) {
//   // 1. Validate input
//   const parsed = categorySchema.safeParse(formData);
//   if (!parsed.success) {
//     throw new AppError(422, `Validation Failed: ${JSON.stringify(parsed.error.format())}`);
//   }

//   if (!parsed.data.addedById) {
//     throw new AppError(400, "addedById is required");
//   }

//   try {
//     // 2. Handle image
//     let imageUrl = "";
//     const file = parsed.data.image;

//     if (file) {
//       const filename = `${Date.now()}-${file instanceof File ? file.name : "image"}`;
//       const outputFormat = "webp";
//       const filePath = path.join("/var/www/images/ekPratisatMonorepo", filename.replace(path.extname(filename), `.${outputFormat}`));

//       let buffer: Buffer;

//       if (file instanceof File) {
//         buffer = Buffer.from(await file.arrayBuffer());
//       } else if (Buffer.isBuffer(file)) {
//         buffer = file;
//       } else {
//         throw new AppError(400, "Invalid file type");
//       }

//       const optimizedBuffer = await sharp(buffer)
//         .resize(1200)
//         .toFormat(outputFormat, { quality: 100 })
//         .toBuffer();

//       await fs.promises.writeFile(filePath, optimizedBuffer);
//       imageUrl = `/categoryImage/${path.basename(filePath)}`;
//     }

//     // 3. Create category in DB
//     const category = await prisma.category.create({
//       data: {
//         name: parsed.data.name,
//         imageUrl: imageUrl || null,
//         addedById: parsed.data.addedById,
//         isAgeOfThePropertyNeeded: parsed.data.isAgeOfThePropertyNeeded,
//         isFacingDirectionNeeded: parsed.data.isFacingDirectionNeeded,
//         isFloorAreaNeeded: parsed.data.isFloorAreaNeeded,
//         isFloorLevelNeeded: parsed.data.isFloorLevelNeeded,
//         isLandAreaNeeded: parsed.data.isLandAreaNeeded,
//         isNoOfFloorsNeeded: parsed.data.isNoOfFloorsNeeded,
//         isNoOfRestRoomsNeeded: parsed.data.isNoOfRestRoomsNeeded,
//         isNoOfRoomsNeeded: parsed.data.isNoOfRoomsNeeded, // fixed typo
//         isRoadSizeNeeded: parsed.data.isRoadSizeNeeded,
//       },
//     });

//     return {
//       status: 200,
//       message: "Category Created Successfully",
//       category,
//     };
//   } catch (error: any) {
//     console.error(error);
//     if (error instanceof AppError) {
//       return error;
//     }
//     throw new AppError(500, "Internal Server Error");
//   }
// }


// fetching categories

