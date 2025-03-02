import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateRideDto } from './dto/create.ride.dto';
import { VehicleType } from '@prisma/client';

@Injectable()
export class RideService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async createRide(body: CreateRideDto, driver_id: string) {
    try {
      return await this.dataBaseService.ride.create({
        data: {
          origin: body.origin,
          destination: body.destination,
          number_of_seats: body.number_of_seats,
          ride_date: body.ride_date,
          ride_price: body.ride_price,
          vehicle: {
            connect: {
              id: body.vehicle_id,
            },
          },
          driver: {
            connect: {
              user_id: driver_id,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getRidesByDriver(user_id: string) {
    try {
      return await this.dataBaseService.ride.findMany({
        where: {
          driver_id: user_id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getRidesByFilter(origin?: string, destination?: string, ride_date?: Date, number_of_seats?: number, ride_price?: number, vehicle_type?: VehicleType) {
    try {
      return await this.dataBaseService.ride.findMany({
        where: {
          vehicle: vehicle_type ? { type: vehicle_type } : undefined,
          origin: origin ? { contains: origin } : undefined,
          destination: destination ? { contains: destination } : undefined,
          ride_date: ride_date
            ? {
                gte: new Date(new Date(ride_date).getTime() - 60 * 60 * 1000), // 1 hour before
                lte: new Date(new Date(ride_date).getTime() + 60 * 60 * 1000), // 1 hour after
              }
            : undefined,
          number_of_seats: number_of_seats ? { gte: number_of_seats } : undefined,
          ride_price: ride_price ? { lte: ride_price } : undefined,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // async getRidesByPassenger(user_id: string) {
  //   try {
  //     return await this.dataBaseService.ride.findMany({
  //       where: {
  //         passenger_id: user_id,
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async updateRideStatus(ride_id: string, ride_status: RideStatus) {
  //   try {
  //     return await this.dataBaseService.ride.update({
  //       where: {
  //         id: ride_id,
  //       },
  //       data: {
  //         ride_status: ride_status,
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
