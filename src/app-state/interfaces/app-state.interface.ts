import mongoose from "mongoose"

export interface AppState {
  _id: mongoose.Types.ObjectId
  foodCategory: string[]
  
}
