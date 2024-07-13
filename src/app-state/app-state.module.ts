import { Module } from '@nestjs/common';
import { AppStateService } from './app-state.service';
import { AppStateController } from './app-state.controller';
import AppStateModel from './models/app-state.model';

@Module({
  controllers: [AppStateController],
  providers: [AppStateService],
  imports: [
    AppStateModel
  ],
})
export class AppStateModule {}
