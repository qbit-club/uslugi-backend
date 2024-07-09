import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import MenuModel from './models/menu.model'
import RestModel from 'src/hall/models/rest.model';

@Module({
  imports: [MenuModel, RestModel],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule {}
