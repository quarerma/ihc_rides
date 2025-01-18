import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { Request } from 'express';
import { JwtAuthGuards } from 'src/auth/guards/jwt.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return this.usersService.create(body);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuards)
  async getUsers(@Req() req: Request) {
    try {
      const user = req.user as any;
      console.log(user.email);
      return this.usersService.getUsers();
    } catch (error) {
      throw new Error(error);
    }
  }
}
