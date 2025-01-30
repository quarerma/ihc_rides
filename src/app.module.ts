import { Module } from '@nestjs/common';
import { DataBaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [DataBaseService],
})
export class AppModule {}
