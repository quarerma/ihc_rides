import { z } from "zod";

import { z } from "zod";

export const CrlvSchema = z.object({
  expiration_date: z.coerce.string(),
  emission_date: z.coerce.string(),
  issued_by: z.string().min(1, "Emitido por é obrigatório"),
});

export const VehicleSchema = z.object({
  type: z.enum(["CAR", "MOTORCYCLE", "VAN"]),
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  fabrication_year: z.coerce.number().int().min(1886, "Ano inválido"),
  color: z.string().min(1, "Cor é obrigatória"),
  plate: z
    .string()
    .regex(/^[A-Z]{3}\d[A-Z]\d{2}$/, "Formato de placa inválido (AAA1A11)"),
  crlv: CrlvSchema,
});
export type CreateVehicle = z.infer<typeof VehicleSchema>;
export type CreateCrlv = z.infer<typeof CrlvSchema>;
