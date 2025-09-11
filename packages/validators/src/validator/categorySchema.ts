import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(2, "Please give valid category"),
    image: z.file(),
    isLandAreaNeeded: z.boolean(),
    isNoOfFloorsNeeded: z.boolean(),
    isNoOfRoomsNeeded: z.boolean(),
    isAgeOfThePropertyNeeded: z.boolean(),
    isNoOfRestRoomsNeeded: z.boolean(),
    isFacingDirectionNeeded: z.boolean(),
    isFloorAreaNeeded: z.boolean(),
    isFloorLevelNeeded: z.boolean(),
    isRoadSizeNeeded: z.boolean(),
    addedById: z.string().optional()
})

export type CategorySchema = z.infer<typeof categorySchema>;