// core imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';

// interfaces
import { HallFromClient } from './interfaces/hall-from-client.interface';

// services
import { HallService } from './hall.service';

@Controller('hall')
export class HallController {
  constructor(
    private HallService: HallService,
  ) { }
  @Post()
  async create(@Body('hall') hall: HallFromClient) {
    return await this.HallService.create(hall)
  }
}
