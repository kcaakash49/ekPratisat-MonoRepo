import { z } from "zod";

export const UpdateLeadSchema = z.object({
  name: z.string().trim().nullable().optional(),
  email: z.string().email().trim().nullable().optional(),
  coordinates: z.string().trim().nullable().optional(),
  notes: z.any().nullable().optional()

})