import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { MailService } from '../mail/mail.service';
import { OrderController } from './order.controller';
import OrderModel from './models/order.model';
import UserModel from 'src/user/models/user.model';
import RestModel from 'src/rest/models/rest.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService, MailService],
  imports: [
    OrderModel,
    UserModel,
    RestModel
  ]
})
export class OrderModule { }
