import { z } from "zod";

export const CrlvSchema = z.object({
  expiration_date: z.coerce.string(),
  emission_date: z.coerce.string(),
  issued_by: z.string().min(1, "Issued by is required"),
});

export const VehicleSchema = z.object({
  type: z.enum(["CAR", "MOTORCYCLE", "VAN"]),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  fabrication_year: z.coerce.number().int().min(1886, "Invalid year"),
  color: z.string().min(1, "Color is required"),
  plate: z
    .string()
    .regex(/^[A-Z]{3}\d[A-Z]\d{2}$/, "Invalid plate format (AAA1A11)"),
  crlv: CrlvSchema,
});

export type CreateVehicle = z.infer<typeof VehicleSchema>;
export type CreateCrlv = z.infer<typeof CrlvSchema>;
