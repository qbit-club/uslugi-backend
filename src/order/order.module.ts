import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MailService } from '../mail/mail.service';
import { RestService } from 'src/rest/rest.service';

import { OrderController } from './order.controller';
import OrderModel from './models/order.model';
import UserModel from 'src/user/models/user.model';
import RestModel from 'src/rest/models/rest.model';
import RestRatingModel from 'src/rest/models/rest-rating.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService, MailService, RestService],
  imports: [
    OrderModel,
    UserModel,
    RestModel, 
    RestRatingModel,
  ]
})
export class OrderModule { }
