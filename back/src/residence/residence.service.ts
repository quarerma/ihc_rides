import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateResidenceDTO } from './dto/create.residence.dto';

@Injectable()
export class ResidenceService {
  constructor(private readonly dataBaseService: DataBaseService){}

  async create(body: CreateResidenceDTO, user_id: string) {
    try {
      
      return await this.dataBaseService.residence.create({
        data: {
          street: body.street,
          number: body.number,
          complement: body.complement,
          neighborhood: body.neighborhood,
          city: body.city,
          state: body.state,
          postal_code: body.postal_code,
          user: {
            connect: {
              id: user_id
            }
          }
        }
      });
    } catch(error) {
      throw new Error(error);
    }
  }
}
