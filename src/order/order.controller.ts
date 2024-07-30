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
  @Post('order-by-orderId')
  async getOrdersByOrdersId(@Body('ordersId') ordersId: string[]) {
    try {
      const orders = await this.OrderModel.find({ _id: { $in: ordersId } },{user:0}).populate('rest', 'title');
      const grouped: { [key: string]:any[] } = {};
      orders.forEach(order => {
        const rest = order.rest.title || "Без названия";
        if (!grouped[rest]) {
            grouped[rest] = [];
        }
        grouped[rest].push(order);
    });
    return Object.keys(grouped)
        .sort()
        .map(rest => ({
            rest,
            orders: grouped[rest]
        }));
      return grouped;
    } catch (error) {
      console.error(error);
    
    }
  }

  
}
