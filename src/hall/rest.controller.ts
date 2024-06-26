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
  @Post('images')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('rest_id') restId: String,
  ) {
    // const s3 = new EasyYandexS3({
    //   auth: {
    //     accessKeyId: process.env.YC_KEY_ID,
    //     secretAccessKey: process.env.YC_SECRET,
    //   },
    //   Bucket: process.env.YC_BUCKET_NAME,
    //   debug: false
    // })
    
    // let filenames = []
    // let buffers = []
    
    // for (let file of files) {
    //   buffers.push({ buffer: file.buffer, name: file.originalname, });    // Буфер загруженного файла
    // }
    
    // if (buffers.length) {
    //   let uploadResult = await s3.Upload(buffers, '/restik/');
      
    //   for (let upl of uploadResult) {
    //     filenames.push(upl.Location)
    //   }
    // }
    
    return await this.RestModel.findByIdAndUpdate(restId, { $set: { images: filenames } })
  }
}
