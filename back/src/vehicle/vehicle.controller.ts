import { Controller, Get, Query, Req } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Post, Body } from '@nestjs/common';
import { CreateVehicleDTO } from './dto/create.vehicle.dto';
import { Request } from 'express';
import { UserRequest } from 'src/types/user.request';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async createVehicle(@Body() body: CreateVehicleDTO, @Req() request: Request) {
    try {
      return this.vehicleService.create(body, (request.user as UserRequest).id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get()
  async getById(@Query() vehicle_id: string) {
    try {
      return await this.vehicleService.getVehicleById(vehicle_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get all vehicles by driver
  @Get('driver')
  async getVehiclesByDriver(@Req() request: Request) {
    try {
      return this.vehicleService.getVehiclesByDriver((request.user as UserRequest).id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
