import { cnhCategory } from "@prisma/client";
import { Crlv } from "./create.crlv.dto";

export class CreateVehicleDTO {
  category: cnhCategory;
  brand: string;
  model: string;
  fabrication_year: number;
  color: string
  plate: string;
  crlv: Crlv;
  user_id: string;
}
