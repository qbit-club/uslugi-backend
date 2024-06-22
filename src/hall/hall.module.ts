import { Module } from '@nestjs/common';
import { HallController } from './hall.controller';
import { HallService } from './hall.service';
import HallModel from './models/hall.model';

@Module({
  controllers: [HallController],
  providers: [HallService],
  imports: [
    HallModel
  ],
})
export class HallModule {}
