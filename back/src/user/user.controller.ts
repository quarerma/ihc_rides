import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { JwtAuthGuards } from 'src/auth/guards/jwt.guards';
import { Request } from 'express';
import { UserRequest } from 'src/types/user.request';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return this.usersService.create(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuards)
  async getSession(@Req() req: Request) {
    try {
      const user = req.user as UserRequest;
      return await this.usersService.getUserById(user.id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuards)
  async getUsers() {
    try {
      return this.usersService.getUsers();
    } catch (error) {
      throw new Error(error);
    }
  }
}
