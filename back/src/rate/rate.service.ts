import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateRateDTO } from './dto/create.rate.dto';

@Injectable()
export class RateService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async create(body: CreateRateDTO) {
    try {
      return await this.dataBaseService.rates.create({
        data: {
          rate: body.value,
          content: body.content,
          target_user: {
            connect: {
              id: body.targetUserId
            }
          },
          source_user: {
            connect: {
              id: body.sourceUserId
            }
          }
        }
      })
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRatesById(user_id: string) {
    try {
      return await this.dataBaseService.rates.findMany({
        where: {
          target_user_id: user_id
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
