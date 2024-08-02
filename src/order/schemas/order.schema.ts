import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as mongoose from 'mongoose';

export type OrderDocument = HydratedDocument<OrderClass>;

@Schema()
export class OrderClass {
  @Prop({
    type: Array,
  })
  items: [
    {
      price: number;
      count: number;
      menuItemId: string;
    },
  ];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rest',
    required: true,
  })
  rest: { _id: mongoose.Schema.Types.ObjectId; title: string };

  @Prop({
    type: Object,
    required: true,
  })
  user: Object;

  @Prop({
    type: String,
    required: true,
  })
  date: string;
}

export const OrderSchema = SchemaFactory.createForClass(OrderClass);
