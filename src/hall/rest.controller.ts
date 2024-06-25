// core imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';

// interfaces
import { RestFromClient } from './interfaces/rest-from-client.interface';

// services
import { RestService } from './rest.service';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestClass } from './schemas/rest.schema';

@Controller('rest')
export class RestController {
  constructor(
    private RestService: RestService,
    @InjectModel('Rest') private RestModel: Model<RestClass>,
  ) { }
  @Post()
  async create(@Body('rest') rest: RestFromClient) {
    return await this.RestModel.create(rest)
  }

  @Get('/all')
  async getAll() {
    return await this.RestModel.find({})
  }
}
