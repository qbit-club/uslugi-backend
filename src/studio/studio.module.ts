import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioController } from './studio.controller';

import StudioModel from './models/studio.model'

@Module({
  controllers: [StudioController],
  providers: [StudioService],
  imports: [
    StudioModel
  ]
})
export class StudioModule { }
