import { FoodListItem } from './interfaces/food-list-item.interface';
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
  ) {}
  @Post()
  async create(@Body('rest') rest: RestFromClient) {
    const restCallback = await this.RestModel.create(rest);
    // await this.UserModel.findByIdAndUpdate(restCallback.author, {
    //   $push: { rests: restCallback._id },
    // });
    return restCallback;
  }
  @Put()
  async update(
    @Body('rest') rest: RestFromClient,
    @Query('rest_id') restId: string,
  ) {
    const restCallback = await this.RestModel.updateOne({ _id: restId }, rest);
    return { _id: restId };
  }
  @Get('all')
  async getAll() {
    return await this.RestModel.find({});
  }
  @Get('rests-name')
  async getRestsName() {
    return await this.RestModel.find({}, { title: 1, managers: 1 });
  }

  // @HttpCode(HttpStatus.OK)
  // @Get('get-managers')
  // async getManagersOfRest(@Query('rest_id') rest_id: string) {
  //   let managers = await this.UserModel.find(
  //     {
  //       roles: {
  //         $elemMatch: { type: 'manager', rest_ids: { $in: [rest_id] } },
  //       },
  //     },
  //     { runValidators: true },
  //   ).populate(['email']);
  //   return managers;
  // }

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
    if (_id == '') return {};
    return await this.RestModel.findById(_id);
  }
  @Post('by-ids')
  async getByIds(@Body('_ids') _ids: string[]) {
    return await this.RestModel.find({ _id: { $in: _ids } });
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

    let setObj = {};
    if (filenames[0]) setObj['images.logo'] = filenames[0];
    if (filenames[1]) setObj['images.headerimage'] = filenames[1];

    return await this.RestModel.findByIdAndUpdate(restId, {
      $set: setObj,
    });
  }

  @Put('/update-food-list')
  async updateFoodListItem(
    @Query('rest_id') restId: string,
    @Query('item_id') foodListItemId: string,
    @Body('foodListItem') foodListItem: FoodListItem,
  ) {
    let rest_id = new mongoose.Types.ObjectId(restId)
    let item_id = new mongoose.Types.ObjectId(foodListItemId)
    await this.RestModel.updateOne(
      {"_id":rest_id,"foodList._id":item_id},
      { $set: { 'foodList.$': foodListItem } },
      {runValidators:true}
    )
    return await this.RestModel.findById({"_id":rest_id}) 
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
      { $addToSet: { menu: foodListItemId } },
      { new: true },
    );
  }
  @Post('food-list')
  async createFoodListItem(
    @Body('foodListItem') foodListItem: FoodListItem,
    @Body('restId') restId: string,
  ) {
    const newFoodListItem = {
      ...foodListItem,
      _id: new mongoose.Types.ObjectId(),
    };
    console.log(newFoodListItem);
    return await this.RestModel.findByIdAndUpdate(
      restId,
      { $push: { foodList: newFoodListItem } },
      { new: true },
    );
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
    let restFromDb = await this.RestModel.findById(restId);
    for (let i = 0; i < restFromDb.foodList.length; i++) {
      if (String(restFromDb.foodList[i]._id) == foodListItemId) {
        restFromDb.foodList[i].images = filenames;
        break;
      }
    }
    restFromDb.markModified('foodList');
    return await restFromDb.save();
  }


  // @Post('move-food-list-item-to-menu')
  // async moveFoodItemToMenu(
  //   @Body('restId') restId: string,
  //   @Body('foodListItemId') foodListItemId: mongoose.Schema.Types.ObjectId,
  // ) {
  //   let restFromDb = await this.RestModel.findById(restId);
  //   for (let id of restFromDb.menu) {
  //     if (String(id) == String(foodListItemId)) {
  //       throw ApiError.BadRequest('Уже в меню');
  //     }
  //   }
  //   restFromDb.menu.push(foodListItemId);

  //   restFromDb.markModified('menu');
  //   return await restFromDb.save();
  // }
  @Delete('delete-from-menu')
  async deleteFromMenu(
    @Query('rest_id') restId: string,
    @Query('menu_item_id') menuItemId: string,
  ) {
    return await this.RestModel.findByIdAndUpdate(
      restId,
      { $pull: { menu: menuItemId } },
      { new: true },
    );
  }

  @Delete('delete-food-list-item')
  async deleteFromFoodList(
    @Query('rest_id') restId: string,
    @Query('food_list_item_id') foodListItemId: string,
  ) {
    await this.RestModel.findByIdAndUpdate(
      restId,
      { $pull: { menu: foodListItemId } },
      { new: true },
    );
    let res= await this.RestModel.findByIdAndUpdate(
      restId,
      { $pull: { "foodList":{"_id": new mongoose.Types.ObjectId(foodListItemId)}} },
      { new: true },
    );
    return res
  }

}
