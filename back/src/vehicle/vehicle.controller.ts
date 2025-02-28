import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Post, Body } from '@nestjs/common';
import { CreateVehicleDTO } from './dto/create.vehicle.dto';
import { Request } from 'express';
import { UserRequest } from 'src/types/user.request';
import { JwtAuthGuards } from 'src/auth/guards/jwt.guards';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @UseGuards(JwtAuthGuards)
  async createVehicle(@Body() body: CreateVehicleDTO, @Req() request: Request) {
    try {
      return this.vehicleService.create(body, (request.user as UserRequest).id);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuards)
  async getById(@Query() vehicle_id: string) {
    try {
      return await this.vehicleService.getVehicleById(vehicle_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get all vehicles by driver
  @Get('driver')
  @UseGuards(JwtAuthGuards)
  async getVehiclesByDriver(@Req() req: Request) {
    try {
      return this.vehicleService.getVehiclesByDriver((req.user as UserRequest).id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
