import { Body, Controller } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { Post, Req } from '@nestjs/common';
import { CreateResidenceDTO } from './dto/create.residence.dto';
import { UserRequest } from 'src/types/user.request';
import { Request } from 'express';

@Controller('residence')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) {}

  @Post()
  async createResidence(@Body() body: CreateResidenceDTO, @Req() request: Request){
    try {
      return this.residenceService.create(body, (request.user as UserRequest).id);
    } catch (error) {
      throw new Error(error);
    }

  }
}
