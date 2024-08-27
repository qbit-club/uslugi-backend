// core imports
import { StudioService } from './studio.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  Response,
} from '@nestjs/common';


// types
import type { StudioFromClient } from './interfaces/studio-from-client.interface';

// mongodb
import { InjectModel } from "@nestjs/mongoose"
import { Model } from 'mongoose';
import { StudioClass } from './schemas/studio.schema'

@Controller('studio')
export class StudioController {
  constructor(
    private readonly studioService: StudioService,
    @InjectModel('Studio') private StudioModel: Model<StudioClass>,
  ) { }

  @Post('/')
  async create(
    @Body('studio') studio: StudioFromClient
  ) {
    return await this.StudioModel.create(studio)
  }
}
