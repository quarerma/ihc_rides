import { Module } from '@nestjs/common';
import { DataBaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ResidenceModule } from './residence/residence.module';

@Module({
  imports: [AuthModule, UserModule, VehicleModule, ResidenceModule],
  controllers: [],
  providers: [DataBaseService],
})
export class AppModule {}
