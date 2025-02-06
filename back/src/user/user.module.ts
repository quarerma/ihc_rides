import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DataBaseService],
})
export class UserModule {}
