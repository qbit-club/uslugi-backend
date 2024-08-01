import type { FoodListItem } from './food-list-item.interface'
import * as mongoose from 'mongoose'

export interface FoodListItemFromDb extends FoodListItem {
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
}