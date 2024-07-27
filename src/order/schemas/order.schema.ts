import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as mongoose from 'mongoose';


export type OrderDocument = HydratedDocument<OrderClass>

@Schema()
export class OrderClass {
  @Prop({
    type: Array
  })
  items: [{
    price: number,
    count: number,
    menuItemId: string
  }]
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rest',
    required: true
  })
  rest: mongoose.Schema.Types.ObjectId

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  })
  user: mongoose.Schema.Types.ObjectId
}

export const OrderSchema = SchemaFactory.createForClass(OrderClass)
