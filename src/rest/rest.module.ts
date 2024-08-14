import { Module } from '@nestjs/common';
import { RestController } from './rest.controller';
import { RestService } from './rest.service';
import RestModel from './models/rest.model';
import UserModel from '../user/models/user.model';
import RestRatingModel from './models/rest-rating.model';

@Module({
  controllers: [RestController],
  providers: [RestService],
  imports: [
    RestModel,
    UserModel,
    RestRatingModel
  ],
})
export class RestModule {}
