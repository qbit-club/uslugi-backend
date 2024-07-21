import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppStateService } from './app-state.service';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppStateClass } from './schemas/app-state.schema';

// process.env.APP_STATE_ID

@Controller('app-state')
export class AppStateController {
  constructor(private readonly appStateService: AppStateService,
    @InjectModel('AppState') private AppStateModel: Model<AppStateClass>,
  ) {}

  @Get()
  getAppState() {
    return this.AppStateModel.findOne({})
  }

  @Get('get-food-categories')
  getAllCategories() {
    return this.appStateService.getAllCategories();
  }

  @Post('create-food-category')
  async createFoodCategory(@Body('category') category: string[]) {
    return this.appStateService.createFoodCategory(category);
  }
  @Get('delete-food-category')
  async deleteFoodCategory(@Query('category') category: String) {
    return this.appStateService.deleteFoodCategory(category);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appStateService.remove(+id);
  }
}
