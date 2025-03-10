import { VehicleType } from '@prisma/client';
import { createCrlv } from './create.crlv.dto';

export class CreateVehicleDTO {
  type: VehicleType;
  brand: string;
  model: string;
  fabrication_year: number;
  color: string;
  plate: string;
  crlv: createCrlv;
}
