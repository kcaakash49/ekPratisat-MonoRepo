import { UploadedFile } from "../authFunctions/addUserFunction.js";
import { AppError } from "../index.js";
import { prisma } from "@repo/database";
import path from "path";
import sharp from "sharp";
import fs from "fs";

type Upload = UploadedFile | null;

export async function createLead({body, file}: {body: any, file: Upload}) {
    try {
        let imageUrl = "";
        if (file) {
          const imageFile = file;
          const filename = Date.now() + "-" + imageFile.originalname;
          const outputFormat = "webp";
          const filePath = path.join(
            "/var/www/ekPratisatMonorepo/images/leadImage",
            filename.replace(path.extname(filename), `.${outputFormat}`),
          );
  
          const optimizedBuffer = await sharp(imageFile.buffer)
            .resize(1200)
            .toFormat(outputFormat, { quality: 100 })
            .toBuffer();
  
          await fs.promises.writeFile(filePath, optimizedBuffer);
  
          imageUrl = `/image/leadImage/${path.basename(filePath)}`;
        }

        await prisma.lead.create({
            data: {
              name: body.name?.trim() ?? null,
              email: body.email?.trim() ?? null,
              contact: body.contact?.trim(),
              coordinates:body.coordinates?.trim() ?? null,
              source: body.source?.trim(),
              clientType: body.clientType,
              propertyId: body.propertyId?.trim() ?? null,
              imageUrl: imageUrl ?? null,
              managedById: body.managedById,
              notes: body.notes ? JSON.parse(body.notes) : null,
              dealType: body.dealType
            },
          });

          return {
            status:200,
            message: "Lead created successfully"
          }
    } catch (error) {
        throw new AppError(500, "Something Happened!!! Please try again later.");
    }
}