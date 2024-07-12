import type { FoodListItem } from './food-list-item.interface'
import * as mongoose from 'mongoose'

export interface FoodListItemFromDb extends FoodListItem {
  _id: mongoose.Types.ObjectId
}