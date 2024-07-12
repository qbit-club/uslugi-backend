import * as mongoose from 'mongoose'

export interface FoodListItem {
  name: string
  category: string
  _id: mongoose.Types.ObjectId | undefined
}