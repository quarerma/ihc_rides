import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DataBaseService],
})
export class UsersModule {}
