import { Module } from '@nestjs/common';
import { DataBaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ResidenceModule } from './residence/residence.module';
import { RateModule } from './rate/rate.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [AuthModule, UserModule, VehicleModule, ResidenceModule, RateModule, RideModule],
  controllers: [],
  providers: [DataBaseService],
})
export class AppModule {}
