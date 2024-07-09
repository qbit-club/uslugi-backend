// core imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
// interfaces
import type { MenuFromClient } from './interfaces/menu-from-client.interface';
// services
import { MenuService } from './menu.service';
import { MenuClass } from './schemas/menu.schema';
// all about MongoDB
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RestClass } from 'src/hall/schemas/rest.schema';

@Controller('menu')
export class MenuController {
  constructor(
    @InjectModel('Menu') private MenuModel: Model<MenuClass>,
    @InjectModel('Rest') private RestModel: Model<RestClass>,
    private MenuService: MenuService,
  ) { }
  /**
   * create new menu document
   * @param menu from client form
   */
  @Post('/')
  async create(@Body() menu: MenuFromClient) {
    let menuFromDb = await this.MenuModel.create(menu)
    return await this.RestModel.findByIdAndUpdate(menuFromDb.restId, { $set: { menu: menuFromDb._id } })
  }
  // @Put('/')
  // async addMenuItems(@Body()) {
    
  // }
}
