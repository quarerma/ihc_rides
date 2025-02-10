import { Controller } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Post, Body } from '@nestjs/common';
import { CreateVehicleDTO } from './dto/create.vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  createVehicle(@Body() body : CreateVehicleDTO) {
    try {
      return this.vehicleService.create(body);
    } catch (error) {
      throw new Error(error);
    }
  }
}
