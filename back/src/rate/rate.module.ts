import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [RateController],
  providers: [RateService, DataBaseService],
})
export class RateModule {}
