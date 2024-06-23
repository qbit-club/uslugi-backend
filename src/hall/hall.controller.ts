// core imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';

// interfaces
import { HallFromClient } from './interfaces/hall-from-client.interface';

// services
import { HallService } from './hall.service';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HallClass } from './schemas/hall.schema';

@Controller('hall')
export class HallController {
  constructor(
    private HallService: HallService,
    @InjectModel('Hall') private HallModel: Model<HallClass>,
  ) { }
  @Post()
  async create(@Body('hall') hall: HallFromClient) {
    return await this.HallModel.create(hall)
  }

  @Get('/all')
  async getAll() {
    return await this.HallModel.find({})
  }
}
