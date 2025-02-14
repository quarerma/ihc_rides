import { Module } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { ResidenceController } from './residence.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [ResidenceController],
  providers: [ResidenceService, DataBaseService],
})
export class ResidenceModule {}
