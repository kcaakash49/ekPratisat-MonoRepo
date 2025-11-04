import { prisma } from "@repo/database";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import bcrypt from "bcrypt";
import pLimit from "p-limit";
import { AppError } from "../error.js";
import { userSignupSchema, UserSingUpSchema } from "@repo/validators";

const PROFILE_IMAGE_DIR = "/var/www/ekPratisatMonorepo/images/profileImage";
const DOCUMENT_IMAGE_DIR = "/var/www/ekPratisatMonorepo/images/idDocument";



type DocType = "CITIZENSHIP_FRONT" | "CITIZENSHIP_BACK" | "CITIZENSHIP_BACK" | "PAN" | "PASSPORT" | "OTHER";

export async function createUser(formData: FormData) {
  // --- 1️⃣ Extract form fields
  const credentials: Partial<UserSingUpSchema> = {
    name: formData.get("name") as string,
    contact: formData.get("contact") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
    role: (formData.get("role") as "client" | "partner" | "admin") ?? "client",
  };

  // --- 2️⃣ Handle profile image
  const profileImage = formData.get("profileImage");
  if (profileImage && profileImage instanceof File) {
    credentials.profileImage = profileImage;
  }

  // --- 3️⃣ Handle documents
  const documentEntries: { type: string; image: File }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("document[")) {
      const match = key.match(/document\[(\d+)\]\[type\]/);
      if (match && value) {
        const index = Number(match[1]);
        const imageKey = `document[${index}][image]`;
        const image = formData.get(imageKey);
        if (image && image instanceof File) {
          documentEntries.push({ type: value as string, image });
        }
      }
    }
  }
  if (documentEntries.length) credentials.document = documentEntries;

  // --- 4️⃣ Validate input
  const result = userSignupSchema.safeParse(credentials);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstErrorPerField: Record<string, string> = {};

    (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).forEach(
      (key) => {
        const firstError = fieldErrors[key]?.[0];
        if (firstError) {
          firstErrorPerField[key] = firstError; // string only
        }
      }
    );

    throw new AppError(422, "Validation failed", firstErrorPerField);
  }

  const userData = result.data;

  // --- 5️⃣ File handling setup
  const uploadedFiles: string[] = []; // for cleanup on failure
  const limit = pLimit(3); // limit concurrent image ops

  async function optimizeAndSave(file: File, destDir: string) {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const filePath = path.join(destDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(buffer)
      .resize(1200)
      .toFormat("webp", { quality: 90 })
      .toBuffer();
    await fs.promises.writeFile(filePath, optimized);
    uploadedFiles.push(filePath);
    return `/image/${path.basename(destDir)}/${filename}`;
  }

  // --- 6️⃣ Prepare upload promises
  const uploadPromises: Promise<void | string>[] = [];
  let profileImageUrl: string | undefined;
  let documentUrls: { type: string; imageUrl: string }[] = [];

  if (userData.profileImage) {
    uploadPromises.push(
      limit(async () => {
        profileImageUrl = await optimizeAndSave(userData.profileImage!, PROFILE_IMAGE_DIR);
      })
    );
  }

  if (userData.document?.length) {
    for (const doc of userData.document) {
      uploadPromises.push(
        limit(async () => {
          const imageUrl = await optimizeAndSave(doc.image, DOCUMENT_IMAGE_DIR);
          documentUrls.push({ type: doc.type, imageUrl });
        })
      );
    }
  }

  // --- 7️⃣ Run uploads
  try {
    await Promise.all(uploadPromises);
  } catch (err) {
    // If upload fails, clean up partials
    await Promise.allSettled(uploadedFiles.map((f) => fs.promises.unlink(f)));
    throw new AppError(500, "Image processing failed");
  }

  // --- 8️⃣ Create user (transaction)
  try {
    const response = await prisma.$transaction(async (tx) => {
      // Duplicate check
      const existing = await tx.user.findFirst({
        where: {
          OR: [{ contact: userData.contact }, { email: userData.email }],
        },
      });
      if (existing) {
        const field =
          existing.contact === userData.contact ? "contact" : "email";
        const msg = `${field === "contact" ? "Contact" : "Email"} already in use`;
        throw new AppError(400, msg, { [field]: msg });
      }

      const hashPassword = await bcrypt.hash(userData.password, 9);

      const user = await tx.user.create({
        data: {
          name: userData.name,
          contact: userData.contact,
          email: userData.email,
          password: hashPassword,
          role: userData.role,
          profileImageUrl: profileImageUrl ?? null,
          documents: documentUrls.length
            ? {
                create: documentUrls.map((data) => ({
                    type: data.type as DocType,
                    url: data.imageUrl
                }))
                
              }
            : undefined,
        },
      });

      return {
        status: 200,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
        },
      };
    });

    return response;
  } catch (error) {
    // --- 9️⃣ Rollback image files if DB fails
    await Promise.allSettled(uploadedFiles.map((f) => fs.promises.unlink(f)));

    if (error instanceof AppError) throw error;
    throw new AppError(500, "Internal server error");
  }
}
