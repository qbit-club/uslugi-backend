import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Table } from '../interfaces/table.interface';
import * as mongoose from 'mongoose';
import type { User } from 'src/user/interfaces/user.interface';
import type { FoodListItem } from '../interfaces/food-list-item.interface'

export type RestDocument = HydratedDocument<RestClass>

@Schema()
class FoodListClass {
  @Prop({
    type: String
  })
  name: string
  @Prop({
    type: String
  })
  category: string
}
const FoodListSchema = SchemaFactory.createForClass(FoodListClass);


@Schema()
export class RestClass {
  @Prop({
    type: String,
    required: true,
    min: 4,
    max: 32
  })
  title: string

  @Prop({
    type: String,
    required: true,
    min: 4,
    max: 32
  })
  alias: string

  @Prop({
    type: String,
    required: true,
  })
  phone: string

  @Prop({
    type: String,
    required: true,
  })
  socialMedia: string

  @Prop({
    type: String,
    required: true,
  })
  description: string


  @Prop({
    type: String,
    required: true,
  })
  schedule: string

  @Prop({
    type: Array,
    required: false,
  })
  images: Object 

  @Prop({
    type: Object,
    required: false,
  })
  location: Object

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  })
  author: User

  @Prop({
    type: Array,
    required: false
  })
  tables: Table[]

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'foodList', unique: true }],
    default: [],
  })
  menu: mongoose.Schema.Types.ObjectId[]

  @Prop({
    type: [FoodListSchema],
  })
  foodList: FoodListItem[]
}

export const RestSchema = SchemaFactory.createForClass(RestClass)
