import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';

// types
import type { Order } from './interfaces/order.interface'

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderClass } from './schemas/order.schema';
import * as mongoose from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';
import { RestClass } from 'src/rest/schemas/rest.schema';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Rest') private RestModel: Model<RestClass>,
  ) { }

  @Post()
  async create(@Body('order') order: Order) {
    let orderFromDb = await this.OrderModel.create(order)

    await this.RestModel.findByIdAndUpdate(orderFromDb.rest, { $push: { orders: orderFromDb._id } })

    return {
      user: order.user?._id ? await this.UserModel.findByIdAndUpdate(order.user?._id, { $push: { orders: orderFromDb._id } }, { new: true }) : order.user,
      order: orderFromDb
    }
  }
  @Post('order-by-orderId')
  async getOrdersByOrdersId(@Body('ordersId') ordersId: string[]) {
    try {
      const orders = await this.OrderModel.find({ _id: { $in: ordersId } }, { user: 0 }).populate('rest', 'title');
      const grouped: { [key: string]: any[] } = {};
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
  /**
   * 
   * @param restId 
   * @returns orders конкретного rest с полной информацией о каждом его поле(populated)
   */
  @Get('by-rest-id')
  async getOrdersByRestId(
    @Query('rest_id') restId: string
  ) {
    let ordersFromDb = await this.OrderModel.find({ rest: restId })
      .populate({
        path: 'user',
        select: ['name', 'email']
      })
    // foodList нужен, чтобы получить информацию по 
    // выбранным пользователем компонентам меню
    // let { foodList } = await this.RestModel.findById(restId)

    // let result = []
    // // делаем то же самое, что и populate с menuItem у order.items
    // for (let order of ordersFromDb) {
    //   let tmp = {
    //     user: order.user,
    //     items: []
    //   }
    //   for (let item of order.items) {

    //     for (let fl of foodList) {
    //       if (item.menuItemId == fl._id?.toString()) {
    //         tmp.items.push({
    //           price: item.price,
    //           count: item.count,
    //           menuItem: fl
    //         })            
    //         break;
    //       }
    //     }
    //   }
    //   result.push(tmp)
    // }
    return ordersFromDb
  }
}
