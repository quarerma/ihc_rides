import { z } from "zod";

export const cnhSchema = z.object({
  serial: z.string().min(1, "Serial is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  expiration_date: z.string().min(1, "Expiration date is required"),
  emission_date: z.string().min(1, "Emission date is required"),
  issued_by: z.string().min(1, "Issued by is required"),
});

export type Cnh = z.infer<typeof cnhSchema>;
