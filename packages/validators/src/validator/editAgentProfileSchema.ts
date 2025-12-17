import { z } from "zod";

export const editAgentBasicProfileSchema = z.object({
  id: z.string(),

  name: z.string().min(2, "Name is required"),
  contact: z.string().min(5, "Primary contact is required").max(10),

  secondaryContact: z
    .string()
    .min(5, "Secondary contact is too short")
    .max(10)
    .nullable()
});

export type EditAgentBasicProfileInput = z.infer<
  typeof editAgentBasicProfileSchema
>;
