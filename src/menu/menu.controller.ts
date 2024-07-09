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

@Controller('menu')
export class MenuController {
  constructor(
    @InjectModel('Menu') private MenuModel: Model<MenuClass>,
    private MenuService: MenuService,
  ) {} 
  /**
   * create new menu document
   * @param menu menu from client form
   * @returns 
   */
  @Post('/')
  async create(@Body() menu: MenuFromClient) {
    return await this.MenuModel.create(menu)
  }

  
}
