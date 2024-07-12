// core imports
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
   * @param menuItem from client form, can be with _id
   * @param restId
   */
  @Put('/')
  async changeMenu(
    @Body('menuItem') menuItem: MenuFromClient,
    @Body('restId') restId: string
  ) {
    if (menuItem._id !== undefined) {
      let menuId = menuItem._id
      delete menuItem._id
      return await this.MenuModel.findById(menuId, { ...menuItem });
    } else {
      let menuId = await this.MenuModel.create(menuItem)
      return await this.RestModel.findByIdAndUpdate(restId, { $push: { menu: menuId } })
    }
  }
}
