import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import MenuModel from './models/menu.model'

@Module({
  imports: [MenuModel],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule {}
