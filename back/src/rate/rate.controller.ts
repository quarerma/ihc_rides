import { Controller, Get, Post, Req } from '@nestjs/common';
import { RateService } from './rate.service';
import { CreateRateDTO } from './dto/create.rate.dto';
import { Request } from 'express';
import { UserRequest } from 'src/types/user.request';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  async createRate(createRateDto: CreateRateDTO) {
    try {
      return this.rateService.create(createRateDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('user')
  async getAllRates(@Req() request: Request) {
    try {
      return this.rateService.getRatesById((request.user as UserRequest).id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
