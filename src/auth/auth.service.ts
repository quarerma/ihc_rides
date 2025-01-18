import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { UserLoginDto } from './dto/user.login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly dataBaseService: DataBaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: UserLoginDto) {
    try {
      const user = await this.dataBaseService.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (await bcrypt.compare(body.password, user.password)) {
        const { password, ...result } = user;

        return this.jwtService.sign(result);
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
