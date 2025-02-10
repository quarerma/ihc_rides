import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [VehicleController],
  providers: [DataBaseService, VehicleService],
})
export class VehicleModule {}
