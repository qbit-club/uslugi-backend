import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Table } from '../interfaces/table.interface';
import * as mongoose from 'mongoose';
import type { User } from 'src/user/interfaces/user.interface';
import type { FoodListItemFromDb } from '../interfaces/food-list-item-from-db.interface'

export type RestDocument = HydratedDocument<RestClass>

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
    type: Array,
    default: [],
  })
  menu: mongoose.Schema.Types.ObjectId[] & FoodListItemFromDb[]

  @Prop({
    type: Array,
  })
  foodList: FoodListItemFromDb[]

  populateMenu() {
    let menu = this.menu
    this.menu = []
    for (let menuItem of menu) {
      for (let foodListItem of this.foodList) {
        if (String(foodListItem._id) == String(menuItem)) {
          this.menu.push(foodListItem)
          break
        }
      }
    }

    return this
  }
}

export const RestSchema = SchemaFactory.createForClass(RestClass)
// без этого кастомные методы не будут работать
RestSchema.loadClass(RestClass)