import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [RideController],
  providers: [RideService, DataBaseService],
})
export class RideModule {}
