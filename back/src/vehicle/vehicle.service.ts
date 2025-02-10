import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateVehicleDTO } from './dto/create.vehicle.dto';
import { create } from 'domain';
import { Crlv } from './dto/create.crlv.dto';
import { cnhCategory } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async create(body: CreateVehicleDTO) {
    try {

      return await this.dataBaseService.vehicle.create({
        data: {
          category: body.category as cnhCategory,
          brand: body.brand,
          model: body.model,
          fabrication_year: body.fabrication_year,
          color: body.color,
          plate: body.plate,
          Crlv: {
            create: {
              expiration_date: body.crlv.expiration_date,
              emission_date: body.crlv.emission_date,
              issued_by: body.crlv.issued_by
            }
          },
          driver: {
            connect: {
              user_id: body.user_id
            }
          }
        }
      });

    }
    catch (error) {
      throw new Error(error);
    }
  }
}
