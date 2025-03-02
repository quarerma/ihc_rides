import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create.ride.dto';
import { UserRequest } from 'src/types/user.request';
import { JwtAuthGuards } from 'src/auth/guards/jwt.guards';
import { VehicleType } from '@prisma/client';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @UseGuards(JwtAuthGuards)
  async createRide(@Body() createRideDto: CreateRideDto, @Req() request: Request) {
    try {
      console.log(createRideDto);
      return await this.rideService.createRide(createRideDto, (request.user as UserRequest).id);
    } catch (error) {
      throw error;
    }
  }

  @Get('driver')
  @UseGuards(JwtAuthGuards)
  async getRidesByDriver(@Req() request: Request) {
    try {
      return this.rideService.getRidesByDriver((request.user as UserRequest).id);
    } catch (error) {
      throw error;
    }
  }

  @Get('filter')
  @UseGuards(JwtAuthGuards)
  async getRidesByFilter(
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
    @Query('ride_date') ride_date?: string,
    @Query('number_of_seats') number_of_seats?: number,
    @Query('ride_price') ride_price?: number,
    @Query('vehicle_type') vehicle_type?: string
  ) {
    try {
      return this.rideService.getRidesByFilter(origin, destination, new Date(ride_date), number_of_seats, ride_price, vehicle_type as VehicleType);
    } catch (error) {
      throw error;
    }
  }

  // @Get('passenger')
  // async getRidesByPassenger(@Req() request: Request) {
  //   try {
  //     return this.rideService.getRidesByPassenger((request.user as UserRequest).id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Patch('status')
  // async updateRideStatus(@Query('ride_id') ride_id: string, ride_status: RideStatus) {
  //   try {
  //     return this.rideService.updateRideStatus(ride_id, ride_status);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
