import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';

// types
import type { Order } from './interfaces/order.interface'

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderClass } from './schemas/order.schema';
import * as mongoose from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
  ) { }

  @Post()
  async create(@Body('order') order: Order) {
    let orderFromDb = await this.OrderModel.create(order)
    return {
      user: await this.UserModel.findByIdAndUpdate(order.user, { $push: { orders: orderFromDb._id } }, { new: true }),
      order: orderFromDb
    }
  }
  @Post()
  async getOrdersByOrdersId(@Body('ordersId') ordersId: Order[]) {

    return await this.OrderModel.findById(ordersId)
  }

  
}
