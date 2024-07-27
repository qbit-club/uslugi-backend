import type { Order } from './order.interface'
import * as mongoose from 'mongoose'

export interface OrderFromDb extends Order {
  _id: mongoose.Types.ObjectId
}