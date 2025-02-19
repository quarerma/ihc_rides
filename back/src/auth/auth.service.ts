import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataBaseService: DataBaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    try {
      const user = await this.dataBaseService.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return { error: 'User not found' };
      }

      if (await bcrypt.compare(body.password, user.password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, email, cpf, ...result } = user;

        return this.jwtService.sign(result);
      }
    } catch (error) {
      console.log(error);
      return { error: 'Error' };
    }
  }

  async validateCpf(cpf: string) {
    try {
      console.log(cpf);
      const user = await this.dataBaseService.user.findUnique({
        where: {
          cpf,
        },
      });

      if (user) {
        throw new HttpException('Invalid or already in use CPF', HttpStatus.CONFLICT);
      }

      return { message: 'Valid CPF' };
    } catch (error) {
      throw error;
    }
  }
}
