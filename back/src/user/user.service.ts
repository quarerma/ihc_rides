import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateUserDTO } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { createCnhDTO } from './dto/create.cnh.dto';

@Injectable()
export class UserService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async create(body: CreateUserDTO) {
    try {
      console.log(body);
      const { password, email } = body;

      if (await this.checkEmail(email)) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }

      const cryptedPassword = await this.hashPassword(password);

      return await this.dataBaseService.user.create({
        data: {
          email,
          user_firstname: body.user_firstname,
          user_lastname: body.user_lastname,
          password: cryptedPassword,
          cpf: body.cpf,
          birth_date: body.birth_date,
        },
      });
    } catch (error) {
      throw error;
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
      const user = await this.dataBaseService.user.findUnique({
        where: {
          id,
        },
        select: {
          email: true,
          user_firstname: true,
          user_lastname: true,
          created_at: true,
          birth_date: true,
          role: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async setUserAsDriver(user_id: string, cnh_data: createCnhDTO) {
    try {
      return await this.dataBaseService.user.update({
        where: {
          id: user_id,
        },
        data: {
          role: 'DRIVER',
          driver: {
            create: {
              cnh: {
                create: {
                  serial: cnh_data.serial,
                  category: {
                    set: cnh_data.category,
                  },
                  expiration_date: cnh_data.expiration_date,
                  emission_date: cnh_data.emission_date,
                  issued_by: cnh_data.issued_by,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
