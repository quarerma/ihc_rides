import { Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create.ride.dto';
import { UserRequest } from 'src/types/user.request';
import { RideStatus } from '@prisma/client';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  async createRide(createRideDto: CreateRideDto, @Query('driver_id') driver_id: string, @Query('vehicle_id') vehicle_id: string, @Query('passenger_id') passenger_id: string) {
    try {
      return await this.rideService.createRide(createRideDto, driver_id, vehicle_id, passenger_id);
    } catch (error) {
      throw error;
    }
  }

  @Get('driver')
  async getRidesByDriver(@Req() request: Request) {
    try {
      return this.rideService.getRidesByDriver((request.user as UserRequest).id);
    } catch (error) {
      throw error;
    }
  }

  @Get('passenger')
  async getRidesByPassenger(@Req() request: Request) {
    try {
      return this.rideService.getRidesByPassenger((request.user as UserRequest).id);
    } catch (error) {
      throw error;
    }
  }

  @Patch('status')
  async updateRideStatus(@Query('ride_id') ride_id: string, ride_status: RideStatus) {
    try {
      return this.rideService.updateRideStatus(ride_id, ride_status);
    } catch (error) {
      throw error;
    }
  }
}
