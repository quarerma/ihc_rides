import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuards } from './guards/jwt.guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    try {
      const payload = await this.authService.login(body);

      if (typeof payload === 'object' && payload.error) {
        throw new HttpException(payload.error, HttpStatus.UNAUTHORIZED);
      }

      console.log(payload);
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/auth-token')
  @UseGuards(JwtAuthGuards)
  async auth(@Req() req: Request) {
    console.log(req.user);
    return { message: 'User is authenticated' };
  }
}
