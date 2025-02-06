import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateUserDTO } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async create(body: CreateUserDTO) {
    try {
      const { password, email } = body;

      if (await this.checkEmail(email)) {
        throw new Error('Email already exists');
      }

      const cryptedPassword = await this.hashPassword(password);

      return await this.dataBaseService.user.create({
        data: {
          email,
          user_firstname: body.user_firstname,
          user_lastname: body.user_lastname,
          password: cryptedPassword,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.dataBaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async getUsers() {
    try {
      return await this.dataBaseService.user.findMany({
        select: {
          email: true,
          user_firstname: true,
          user_lastname: true,
          created_at: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(id: string) {
    try {
      return await this.dataBaseService.user.findUnique({
        where: {
          id,
        },
        select: {
          email: true,
          user_firstname: true,
          user_lastname: true,
          created_at: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
