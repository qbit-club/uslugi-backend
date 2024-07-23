// core imports
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
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import ApiError from 'src/exceptions/errors/api-error';

// interfaces
import type { RestFromClient } from './interfaces/rest-from-client.interface';
import type { FoodListItem } from './interfaces/food-list-item.interface';

// services
import { RestService } from './rest.service';
import YaCloud from 'src/s3/bucket';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestClass } from './schemas/rest.schema';
import { UserClass } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';

@Controller('rest')
export class RestController {
  constructor(
    private RestService: RestService,
    @InjectModel('Rest') private RestModel: Model<RestClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
  ) { }
  @Post()
  async create(@Body('rest') rest: RestFromClient) {
    console.log(rest);

    const restCallback = await this.RestModel.create(rest);
    await this.UserModel.findByIdAndUpdate(restCallback.author, {
      $push: { rests: restCallback._id },
    });
    return restCallback;
  }

  @Get('all')
  async getAll() {
    return await this.RestModel.find({});
  }

  @Get('delete')
  async deleteRest(@Query('rest_id') restId: String) {
    await this.UserModel.updateOne(
      { rests: restId },
      { $pull: { rests: restId } },
    );
    return await this.RestModel.findByIdAndDelete(restId);
  }
  @Post('one-by-alias')
  async oneByAlias(@Body('alias') alias: string) {
    return (await this.RestModel.findOne({ alias })).populateMenu();
  }
  @Get('by-id')
  async getById(@Query('_id') _id: string) {
    if (_id == '') return {}
    return await this.RestModel.findById(_id)
  }
  @Post('images')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('rest_id') restId: String,
  ) {
    let filenames = [];

    for (let file of files) {
      let uploadResult = await YaCloud.Upload({
        file,
        path: 'restaurants',
        fileName: file.originalname,
      });
      filenames.push(uploadResult.Location);
    }
    return await this.RestModel.findByIdAndUpdate(restId, {
      $set: { 'images.logo': filenames[0], 'images.headerimage': filenames[1] },
    });
  }
  @Put('/food-list')
  async changeFoodList(
    @Body('restId') restId: string,
    @Body('foodListItem') foodListItem: FoodListItem,
  ) {
    return 'deprecated route'
    // if (foodListItem?._id !== undefined) {
    //   await this.RestModel.updateOne(
    //     { _id: restId, 'foodList._id': foodListItem._id },
    //     { $set: { 'foodList.$': foodListItem } },
    //   );
    //   return await this.RestModel.findById(restId);
    // }
    // return await this.RestModel.findByIdAndUpdate(
    //   restId,
    //   { $push: { foodList: foodListItem } },
    //   { new: true },
    // );
  }
  @Post('/menu')
  async addToMenu(
    @Body('foodListItemId') foodListItemId: string,
    @Body('restId') restId: string,
  ) {
    return await this.RestModel.findByIdAndUpdate(
      restId,
      { $push: { menu: foodListItemId } },
      { new: true },
    );
  }
  @Post('food-list')
  async createFoodListItem(
    @Body('foodListItem') foodListItem: FoodListItem,
    @Body('restId') restId: string,
  ) {
    return await this.RestModel.findByIdAndUpdate(restId, { $push: { foodList: foodListItem } }, { new: true })
  }
  @Post('food-list-images')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFoodListImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('rest_id') restId: String,
    @Query('item_id') foodListItemId: String,
  ) {
    let filenames = [];

    for (let file of files) {
      let uploadResult = await YaCloud.Upload({
        file,
        path: 'restaurants',
        fileName: file.originalname,
      });
      filenames.push(uploadResult.Location);
    }
    let restFromDb = await this.RestModel.findById(restId)
    for (let i = 0; i < restFromDb.foodList.length; i++) {
      if (restFromDb.foodList[i]._id.toString() == foodListItemId) {
        restFromDb.foodList[i].images = filenames
        break
      }
    }
    restFromDb.markModified('foodList')
    return await restFromDb.save()
  }
  @Patch('move-food-list-item-to-menu')
  async moveFoodItemToMenu(
    @Body('restId') restId: string,
    @Body('foodListItemId') foodListItemId: mongoose.Schema.Types.ObjectId
  ) {
    let restFromDb = await this.RestModel.findById(restId)
    for (let id of restFromDb.menu) {
      if (String(id) == String(foodListItemId)) {
        throw ApiError.BadRequest('Уже в меню')
      }
    }
    restFromDb.menu.push(foodListItemId)

    restFromDb.markModified('menu')
    return await restFromDb.save()
  }
  @Delete('delete-from-menu')
  async deleteFromMenu(
    @Query('rest_id') restId: string,
    @Query('menu_item_id') menuItemId: string,
  ) {
    return await this.RestModel.findByIdAndUpdate(restId, { $pull: { menu: menuItemId } }, { new: true })
  }
}