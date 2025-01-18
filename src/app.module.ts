import { Module } from '@nestjs/common';
import { DataBaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [],
  providers: [DataBaseService],
})
export class AppModule {}
