// core imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

// interfaces
import { RestFromClient } from './interfaces/rest-from-client.interface';

// services
import { RestService } from './rest.service';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestClass } from './schemas/rest.schema';
import YaCloud from 'src/s3/bucket';

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

  @Get('all')
  async getAll() {
    return await this.RestModel.find({})
  }
  @Post('one-by-alias')
  async oneByAlias(@Body('alias') alias: string) {
    return await this.RestModel.findOne({alias})
  }

  @Post('images')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('rest_id') restId: String,
  ) {
    let filenames = []
    
    for (let file of files) {
      let uploadResult = await YaCloud.Upload({ file, path: 'restaurants', fileName: file.originalname})
      filenames.push(uploadResult.Location)
    };
    
    return await this.RestModel.findByIdAndUpdate(restId, { $set: { images: filenames } })
  }
}
