import * as z from "zod";
export const fromSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
});

export type fromType = z.infer<typeof fromSchema>;
