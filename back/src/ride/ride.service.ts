import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CreateRideDto } from './dto/create.ride.dto';

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
