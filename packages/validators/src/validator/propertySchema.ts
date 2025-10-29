import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(4, "Atleast 4 letter word is needed!!!"),
  description: z.string(),
  price: z.string(),
  type: z.enum(["rent", "sale"]),
  categoryId: z.string(),
  noOfBedRooms: z.string().nullable(),
  noOfRestRooms: z.string().nullable(),
  landArea: z.string().nullable(),
  noOfFloors: z.string().nullable(),
  propertyAge: z.string().nullable(),
  facingDirection: z.enum(["east", "west", "north", "south", "northeast", "northewest", "southeast", "southwest"]).nullable(),
  floorArea: z.string().nullable(),
  roadSize: z.string().nullable(),
  floorLevel: z.string().nullable(),
  verified: z.boolean().default(false),
  locationId: z.string(),
  tole: z.string(),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required").optional(),
});


export type CreatePropertySchema = z.infer<typeof createPropertySchema>;