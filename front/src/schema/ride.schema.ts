import { z } from "zod";

export const CreateRideSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  ride_date: z.coerce.string(),
  number_of_seats: z.number().int().positive(),
  ride_price: z.number().nonnegative(),
  vehicle_id: z.string(),
});

export type CreateRideDto = z.infer<typeof CreateRideSchema>;
