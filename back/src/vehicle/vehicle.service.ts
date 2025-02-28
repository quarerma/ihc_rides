import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateVehicleDTO } from './dto/create.vehicle.dto';
import { VehicleType } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async create(body: CreateVehicleDTO, user_id: string) {
    try {
      // Fetch driver CNH categories
      const driver = await this.dataBaseService.driver.findUnique({
        where: { user_id },
        include: { cnh: true }, // Assuming 'cnh' is an array of categories
      });

      console.log('Driver:', driver);
      if (!driver || !Array.isArray(driver.cnh.category) || driver.cnh.category.length === 0) {
        throw new Error('Driver not found or CNH categories are missing.');
      }

      // Convert CNH categories to uppercase for consistency
      const cnhCategories = driver.cnh.category.map((category) => category.toUpperCase());

      console.log('Driver CNH categories:', cnhCategories);
      // CNH category permissions mapped to vehicle types
      const cnhPermissions: Record<string, VehicleType[]> = {
        A: [VehicleType.MOTORCYCLE],
        B: [VehicleType.CAR, VehicleType.VAN],
        C: [VehicleType.CAR, VehicleType.VAN],
        D: [VehicleType.CAR, VehicleType.VAN],
        E: [VehicleType.CAR, VehicleType.VAN],
      };

      // Check if the driver has at least one valid CNH category for the vehicle type
      const canRegister = cnhCategories.some((category) => cnhPermissions[category]?.includes(body.type));

      if (!canRegister) {
        throw new Error(`Driver with CNH categories [${cnhCategories.join(', ')}] is not allowed to register a ${body.type}`);
      }

      // Register the vehicle
      return await this.dataBaseService.vehicle.create({
        data: {
          brand: body.brand,
          model: body.model,
          fabrication_year: body.fabrication_year,
          color: body.color,
          plate: body.plate,
          type: body.type,
          Crlv: {
            create: {
              expiration_date: body.crlv.expiration_date,
              emission_date: body.crlv.emission_date,
              issued_by: body.crlv.issued_by,
            },
          },
          driver: {
            connect: {
              user_id,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getVehicleById(id: string) {
    try {
      return await this.dataBaseService.vehicle.findUnique({
        where: {
          id,
        },
        include: {
          Crlv: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVehiclesByDriver(user_id: string) {
    try {
      return await this.dataBaseService.vehicle.findMany({
        where: {
          driver: {
            user_id: user_id,
          },
        },
        include: {
          Crlv: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
